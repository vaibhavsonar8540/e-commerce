const Order = require("../Model/orderSchema");
const Cart = require("../Model/cartSchema");
const Product = require("../Model/productModel");
const User = require("../Model/userModel");
const mongoose = require("mongoose");

const orderController = {
    // 0. CREATE RAZORPAY ORDER
    createRazorpayOrder: async (req, res) => {
        try {
            const { amount } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({ success: false, message: "Invalid order amount" });
            }

            const Razorpay = require("razorpay");
            const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_VeloraStore2026Key";
            const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret_VeloraStore2026Sec";

            let order;
            try {
                const instance = new Razorpay({
                    key_id,
                    key_secret,
                });

                const options = {
                    amount: Math.round(amount * 100),
                    currency: "INR",
                    receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                };

                order = await instance.orders.create(options);
            } catch (rzpErr) {
                console.warn("[RAZORPAY API WARN] Using fallback order ID:", rzpErr.message);
                order = {
                    id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    amount: Math.round(amount * 100),
                    currency: "INR",
                    receipt: `rcpt_${Date.now()}`,
                };
            }

            return res.status(200).json({
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: key_id,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // 1. PLACE A NEW ORDER
    placeOrder: async (req, res) => {
        const userId = req.user?.id;
        const { shippingAddress, paymentId, paymentMethod } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({ success: false, message: "Missing shipping address." });
        }
        const finalPaymentId = paymentId || `PAY_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Fetch user data within the session to accurately check order history count
            const user = await User.findById(userId).session(session);
            if (!user) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ success: false, message: "User profile not found." });
            }

            // Fetch cart inside the session
            const cart = await Cart.findOne({ userId }).populate("items.productId").session(session);
            
            if (!cart || cart.items.length === 0) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, message: "Your cart is empty. Cannot place an order." });
            }

            let totalAmount = 0;
            const orderItems = [];

            // Loop to validate data and build snapshots
            for (const item of cart.items) {
                const product = item.productId;

                if (!product) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(404).json({ success: false, message: "One of the products in your cart no longer exists." });
                }

                if (product.stock < item.quantity) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ 
                        success: false, 
                        message: `Not enough stock for ${product.productName}. Only ${product.stock} left.` 
                    });
                }

                // Core Logic Check: Track product pricing based on quantity multiplication
                const currentPrice = product.discountedPrice || product.price;
                totalAmount += currentPrice * item.quantity; // Accumulate subtotal base logic

                orderItems.push({
                    productid: product._id,
                    productName: product.productName,
                    price: currentPrice,
                    quantity: item.quantity
                });
            }

            const discount = Number(req.body.discountAmount) || 0;
            if (discount > 0) {
                totalAmount = Math.max(0, totalAmount - discount);
            }

            // Create the Order with the final totalAmount
            const [newOrder] = await Order.create([{
                userId,
                items: orderItems,
                totalAmount, // Holds the safe final calculated value
                shippingAddress,
                paymentStatus: "Paid",
                orderStatus: "Processing",
                paymentId: finalPaymentId
            }], { session });

            // Deduct inventory stock
            for (const item of cart.items) {
                await Product.findByIdAndUpdate(
                    item.productId._id, 
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }

            // Increment user's buy count by +1 after order placement
            await User.findByIdAndUpdate(
                userId,
                { $inc: { userBuyCount: 1, orderCount: 1 } },
                { session }
            );

            // Clear cart
            cart.items = [];
            await cart.save({ session });

            // Commit all changes concurrently
            await session.commitTransaction();
            session.endSession();

            return res.status(201).json({
                success: true,
                message: "Order placed successfully.",
                data: newOrder
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                success: false,
                message: "Internal server error. Order was not processed.",
                error: error.message
            });
        }
    },

    // 2. GET USER'S ORDER HISTORY
    getOrderHistory: async (req, res) => {
        const userId = req.user?.id;
        try {
            const orders = await Order.find({ userId }).sort({ createdAt: -1 });
            return res.status(200).json({ success: true, count: orders.length, data: orders });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
        }
    },

    // 3. CANCEL AN ACTIVE ORDER (Restores First-Buy Status Safely)
    cancelOrder: async (req, res) => {
        const { orderId } = req.body;
        const userId = req.user?.id;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const order = await Order.findOne({ _id: orderId, userId }).session(session);
            if (!order) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ success: false, message: "Order not found." });
            }

            if (order.orderStatus === "Cancelled") {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, message: "Order is already cancelled." });
            }

            // Update Order Status
            order.orderStatus = "Cancelled";
            order.paymentStatus = "Failed"; 
            await order.save({ session });

            // Restock inventory products back
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productid, { $inc: { stock: item.quantity } }, { session });
            }

            // Decrement orderCount and userBuyCount ONLY if currently greater than 0
            await User.findOneAndUpdate(
                { _id: userId, userBuyCount: { $gt: 0 } }, 
                { $inc: { userBuyCount: -1, orderCount: -1 } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ success: true, message: "Order cancelled and status verified." });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // 4. PROCESS A COMPLETED ORDER RETURN (Restores First-Buy Status Safely)
    returnOrder: async (req, res) => {
        const { orderId } = req.body;
        const userId = req.user?.id;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const order = await Order.findOne({ _id: orderId, userId }).session(session);
            
            // Return validation: Only allow if it was already Delivered
            if (!order || order.orderStatus !== "Delivered") {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, message: "Order cannot be returned." });
            }

            order.orderStatus = "Cancelled"; 
            order.paymentStatus = "Refunded";
            await order.save({ session });

            // Restock products
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productid, { $inc: { stock: item.quantity } }, { session });
            }

            // Decrement orderCount and userBuyCount safely ensuring it stays >= 0
            await User.findOneAndUpdate(
                { _id: userId, userBuyCount: { $gt: 0 } }, 
                { $inc: { userBuyCount: -1, orderCount: -1 } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ success: true, message: "Return processed successfully." });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = orderController;