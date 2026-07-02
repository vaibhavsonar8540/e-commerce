const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    quantity : {
        type : Number ,
        default : 1 ,
        max : 10
    } ,

    product : {
        type : mongoose.Schema.Types.ObjectId ,
        required : true ,
        ref : "Product"
    } ,

    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
} , 
{
     timestamps: true,
})

const cartModel = mongoose.model("cart" , cartSchema)

module.exports = cartModel