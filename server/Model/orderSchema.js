const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            productid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            // if product is changed or deleted after user purchase so in user's billing order history it will still shows user after deleting product beacuse that stored in productname and price 
            productName: { type: String, required: true }, // Snapshotted name
            price: { type: Number, required: true },       // Snapshotted price paid
            quantity: { type: Number, required: true }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending"
    },

    orderStatus: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing"
    },

    paymentId: {
        type: String // To store Stripe/Razorpay transaction reference
    }
})


const Order = mongoose.model("Order" , orderSchema)
module.exports = Order