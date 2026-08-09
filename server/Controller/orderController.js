const Order = require("../Model/orderSchema");
const Cart = require("../Model/cartSchema");
const Product = require("../Model/productModel");
const User = require("../Model/userModel");
const mongoose = require("mongoose");
const crypto = require("crypto");

const orderController = {
    // 0. CREATE RAZORPAY ORDER
    createRazorpayOrder: async (req, res) => {
        try {
            const { amount } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({ success: false, message: "Invalid order amount" });
            }

            const Razorpay = require("razorpay");
            const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_TNjIaRUsYunrIB";
            const key_secret = process.env.RAZORPAY_KEY_SECRET || "u3M1RbOE04hgPSXBxQwHUvsM";

            let order;
            let isRealOrder = false;
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
                isRealOrder = true;
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
                isRealOrder,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // 1. PLACE A NEW ORDER (Transactional all-or-nothing with stock reduction and Razorpay verification)
    placeOrder: async (req, res) => {
        const userId = req.user?.id;
        const {
            shippingAddress,
            paymentId,
            paymentMethod,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({ success: false, message: "Missing shipping address." });
        }

        // Razorpay Payment Verification check if signature is provided
        if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
            const key_secret = process.env.RAZORPAY_KEY_SECRET || "u3M1RbOE04hgPSXBxQwHUvsM";
            const generated_signature = crypto
                .createHmac("sha256", key_secret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest("hex");

            if (generated_signature !== razorpay_signature) {
                return res.status(400).json({
                    success: false,
                    message: "Razorpay payment verification failed. Invalid signature.",
                });
            }
        }

        const finalPaymentId = paymentId || razorpay_payment_id || `PAY_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Fetch user data within the transaction session
            const user = await User.findById(userId).session(session);
            if (!user) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ success: false, message: "User profile not found." });
            }

            // Fetch cart inside the transaction session
            const cart = await Cart.findOne({ userId }).populate("items.productId").session(session);

            if (!cart || cart.items.length === 0) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, message: "Your cart is empty. Cannot place an order." });
            }

            let totalAmount = 0;
            const orderItems = [];

            // 1. Validate data & check available stock
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
                        message: `Not enough stock for ${product.productName}. Only ${product.stock} units available.`
                    });
                }

                const currentPrice =
                    product.discountPrice != null && product.discountPrice > 0 && product.discountPrice < product.price
                        ? product.discountPrice
                        : product.discountedPrice != null && product.discountedPrice > 0 && product.discountedPrice < product.price
                        ? product.discountedPrice
                        : product.price;

                totalAmount += currentPrice * item.quantity;

                orderItems.push({
                    productid: product._id,
                    seller: product.seller,
                    productName: product.productName,
                    price: currentPrice,
                    quantity: item.quantity,
                });
            }

            const discount = Number(req.body.discountAmount) || 0;
            const appliedCouponCode = req.body.couponCode || "";
            if (discount > 0) {
                totalAmount = Math.max(0, totalAmount - discount);
            }

            // 2. Reduce inventory stock & increase totalSales ATOMICALLY inside transaction session
            for (const item of cart.items) {
                const prodId = item.productId._id || item.productId;
                const updatedProduct = await Product.findOneAndUpdate(
                    { _id: prodId, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity, totalSales: item.quantity } },
                    { session, new: true }
                );

                if (!updatedProduct) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({
                        success: false,
                        message: `Stock update failed for item ${item.productId.productName || prodId}. Insufficient quantity available.`
                    });
                }
            }

            // 3. Create the Order document in session
            const isOnline = paymentMethod !== "Cash on Delivery" && paymentMethod !== "COD";
            const [newOrder] = await Order.create(
                [{
                    userId,
                    items: orderItems,
                    totalAmount,
                    shippingAddress,
                    couponCode: appliedCouponCode,
                    discountAmount: discount,
                    paymentStatus: isOnline ? "Paid" : "Pending",
                    orderStatus: "Processing",
                    paymentId: finalPaymentId,
                }],
                { session }
            );

            // 4. Increment user buy count & order count
            await User.findByIdAndUpdate(
                userId,
                { $inc: { userBuyCount: 1, orderCount: 1 } },
                { session }
            );

            // 5. Clear cart in session
            cart.items = [];
            await cart.save({ session });

            // 6. Commit transaction (All or Nothing)
            await session.commitTransaction();
            session.endSession();

            return res.status(201).json({
                success: true,
                message: "Order placed successfully.",
                data: newOrder,
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                success: false,
                message: "Internal server error. Order was not processed.",
                error: error.message,
            });
        }
    },

    // 2. GET USER'S ORDER HISTORY
    getOrderHistory: async (req, res) => {
        const userId = req.user?.id;
        try {
            const orders = await Order.find({ userId })
                .populate({
                    path: "items.productid",
                    select: "productName thumbnail price"
                })
                .sort({ createdAt: -1 });
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
    },

    // 5. GET ORDERS RECEIVED BY A SELLER FOR THEIR PRODUCTS
    getSellerOrders: async (req, res) => {
        const sellerId = req.user?.id;
        try {
            // Find all products created/owned by this seller
            const sellerProducts = await Product.find({ seller: sellerId }).select("_id productName thumbnail price");
            const sellerProductIds = sellerProducts.map((p) => p._id.toString());

            // Query Orders matching seller ID in items or matching product IDs
            const orders = await Order.find({
                $or: [
                    { "items.seller": sellerId },
                    { "items.productid": { $in: sellerProducts.map((p) => p._id) } }
                ]
            })
            .populate("userId", "fullname email phone")
            .populate({
                path: "items.productid",
                select: "productName thumbnail price seller"
            })
            .sort({ createdAt: -1 });

            // Process each order to filter products belonging to this seller
            const sellerOrders = orders.map((order) => {
                const orderObj = order.toObject();

                const filteredItems = orderObj.items.filter((item) => {
                    const itemSellerId = item.seller?._id?.toString() || item.seller?.toString() || item.productid?.seller?._id?.toString() || item.productid?.seller?.toString();
                    const prodIdStr = item.productid?._id?.toString() || item.productid?.toString();
                    return itemSellerId === sellerId.toString() || sellerProductIds.includes(prodIdStr);
                });

                const sellerSubtotal = filteredItems.reduce(
                    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                    0
                );

                return {
                    ...orderObj,
                    items: filteredItems,
                    sellerSubtotal
                };
            }).filter((order) => order.items.length > 0);

            return res.status(200).json({
                success: true,
                count: sellerOrders.length,
                data: sellerOrders
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch seller orders.",
                error: error.message
            });
        }
    },

    // 6. UPDATE ORDER STATUS (For Sellers & Admins)
    updateOrderStatus: async (req, res) => {
        const { orderId, orderStatus } = req.body;

        const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
        if (!orderId || !orderStatus || !validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID or status provided. Allowed: Processing, Shipped, Delivered, Cancelled"
            });
        }

        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found." });
            }

            const previousStatus = order.orderStatus;
            order.orderStatus = orderStatus;

            if (orderStatus === "Delivered") {
                order.paymentStatus = "Paid";
            }

            // Restock products if status changed to Cancelled
            if (orderStatus === "Cancelled" && previousStatus !== "Cancelled") {
                for (const item of order.items) {
                    if (item.productid) {
                        await Product.findByIdAndUpdate(item.productid, { $inc: { stock: item.quantity } });
                    }
                }
            }

            await order.save();

            return res.status(200).json({
                success: true,
                message: `Order status updated to ${orderStatus}`,
                data: order
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to update order status.",
                error: error.message
            });
        }
    }
};

module.exports = orderController;