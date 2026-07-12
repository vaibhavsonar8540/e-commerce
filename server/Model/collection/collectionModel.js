const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },

    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    order:{
        type:Number,
        default:0
    },

    isActive:{
        type:Boolean,
        default:true
    }

},{timestamps:true})

const CollectionValue = mongoose.model("CollectionValue",collectionSchema);

module.exports = CollectionValue