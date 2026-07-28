const Cart = require("../Model/cartSchema");
const Product = require("../Model/productModel");
const User = require("../Model/userModel");

const cartController = {
    // 1. ADD OR UPDATE ITEM IN CART
    addToCart: async (req, res) => {
        const { productId, quantity } = req.body;
        const userId = req.user?.id; // Populated by your auth middleware

        try {
            // Basic validation
            if (!productId || !userId) {
                return res.status(400).json({ success: false, message: "Invalid request data." });
            }

            const quantityToAdd = Number(quantity) || 1;

            // Check if the product actually exists and is in stock
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found." });
            }

            if (product.stock < quantityToAdd) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} units available in stock.`
                });
            }

            // Find user's cart or create a new one if it doesn't exist
            let cart = await Cart.findOne({ userId });

            if (!cart) {
                cart = await Cart.create({
                    userId,
                    items: [{ productId, quantity: quantityToAdd }]
                });
            } else {
                // Check if product already exists in the cart
                const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

                if (itemIndex > -1) {
                    // Product exists, update the quantity
                    const newQuantity = cart.items[itemIndex].quantity + quantityToAdd;

                    // Double check stock against total combined quantity
                    if (product.stock < newQuantity) {
                        return res.status(400).json({
                            success: false,
                            message: `Cannot add more. Total cart quantity exceeds available stock (${product.stock}).`
                        });
                    }

                    cart.items[itemIndex].quantity = newQuantity;
                } else {
                    // Product doesn't exist, push new item to array
                    cart.items.push({ productId, quantity: quantityToAdd });
                }

                await cart.save();
            }

            return res.status(200).json({
                success: true,
                message: "Product added to cart successfully.",
                data: cart
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error.",
                error: error.message
            });
        }
    },

    // 2. GET USER'S CART WITH PRODUCT DETAILS & DYNAMIC FIRST-BUY DISCOUNT
    getCart: async (req, res) => {
        const userId = req.user?.id;

        try {
                        const cart = await Cart.findOne({ userId }).populate({
                path: "items.productId",
                select: "productName price discountedPrice images stock thumbnail"
            });

            if (!cart || cart.items.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "Cart is empty.",
                    data: { userId, items: [], subTotal: 0, discountApplied: 0, grandTotal: 0 }
                });
            }

            let subTotal = 0;
            const itemsWithTotals = [];

            // Calculate multiplied totals per item based on quantity
            for (const item of cart.items) {
                const product = item.productId;
                if (!product) continue;

                const basePrice = product.discountedPrice || product.price;
                const itemTotal = basePrice * item.quantity; // Price multiplied by quantity
                subTotal += itemTotal;

                itemsWithTotals.push({
                    product: product,
                    quantity: item.quantity,
                    itemTotal: itemTotal
                });
            }

            const discountAmount = 0;
            const grandTotal = subTotal;

            return res.status(200).json({
                success: true,
                message: "Cart retrieved successfully.",
                data: {
                    userId: cart.userId,
                    items: itemsWithTotals,
                    subTotal: subTotal,
                    discountApplied: discountAmount,
                    grandTotal: grandTotal,
                }
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error.",
                error: error.message
            });
        }
    },

    // 3. UPDATE ITEM QUANTITY IN CART DIRECTLY
    updateQuantity: async (req, res) => {
        const { productId, quantity } = req.body;
        const userId = req.user?.id;

        try {
            if (!productId || !userId) {
                return res.status(400).json({ success: false, message: "Invalid request data." });
            }

            const targetQty = Number(quantity);
            let cart = await Cart.findOne({ userId });

            if (cart) {
                const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

                if (itemIndex > -1) {
                    if (targetQty <= 0) {
                        // If quantity set to 0 or below, remove item
                        cart.items.splice(itemIndex, 1);
                    } else {
                        // Check product stock before setting
                        const product = await Product.findById(productId);
                        if (!product) {
                            return res.status(404).json({ success: false, message: "Product not found." });
                        }
                        if (product.stock < targetQty) {
                            return res.status(400).json({
                                success: false,
                                message: `Only ${product.stock} units available in stock.`
                            });
                        }
                        cart.items[itemIndex].quantity = targetQty;
                    }
                    await cart.save();
                }
            }

            return res.status(200).json({
                success: true,
                message: "Cart quantity updated successfully.",
                data: cart
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error.",
                error: error.message
            });
        }
    },

    // 4. REMOVE ITEM FROM CART
    removeFromCart: async (req, res) => {
        const { productId } = req.body;
        const userId = req.user?.id;

        try {
            if (!productId || !userId) {
                return res.status(400).json({ success: false, message: "Invalid request data." });
            }

            let cart = await Cart.findOne({ userId });

            if (cart) {
                cart.items = cart.items.filter(item => item.productId.toString() !== productId);
                await cart.save();
            }

            return res.status(200).json({
                success: true,
                message: "Item removed from cart.",
                data: cart
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error.",
                error: error.message
            });
        }
    }
};

module.exports = cartController;