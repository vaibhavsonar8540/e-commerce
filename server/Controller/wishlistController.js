const Wishlist = require("../Model/wishlistSchema");
const Product = require("../Model/productModel");

const wishlistController = {
    // 1. ADD ITEM TO WISHLIST
    addToFav: async (req, res) => {
        const { productId } = req.body;
        const userId = req.user?.id; // Safely access id from auth middleware

        try {
            // Basic validation
            if (!productId || !userId) {
                return res.status(400).json({ success: false, message: "Invalid request data." });
            }

            // Check if the product actually exists
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found." });
            }

            // Find user's wishlist
            let wishList = await Wishlist.findOne({ userId });
            
            if (!wishList) {
                // If no wishlist exists, create a new one with the product in the array
                wishList = await Wishlist.create({
                    userId, 
                    productId: [productId] // Matches your schema array name
                });
            } else {
                // Check if product already exists in the wishlist array
                const productExists = wishList.productId.some(id => id.toString() === productId);

                if (productExists) {
                    return res.status(400).json({ // 400 or 409 is standard for duplicates
                        success: false,
                        message: "Product already in wishlist"
                    });
                }
                
                // Add new product ID to the array
                wishList.productId.push(productId);
                await wishList.save();
            }

            return res.status(200).json({
                success: true,
                message: "Product added to wishlist successfully.",
                data: wishList
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error.",
                error: error.message
            });
        }
    },

    // 2. GET USER'S WISHLIST WITH PRODUCT DETAILS
    getWishlist: async (req, res) => {
        const userId = req.user?.id;

        try {
            // Find the wishlist and populate the products in the array
            const wishList = await Wishlist.findOne({ userId }).populate({
                path: "productId", // Path to populate matches your schema
                select: "productName price discountedPrice images stock" // Only fetch essential UI fields
            });

            if (!wishList) {
                // Return an empty structure to protect the frontend from crashing
                return res.status(200).json({
                    success: true,
                    message: "Wishlist is empty.",
                    data: { userId, productId: [] }
                });
            }

            return res.status(200).json({
                success: true,
                message: "Wishlist retrieved successfully.",
                data: wishList
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

module.exports = wishlistController;