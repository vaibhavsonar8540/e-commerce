const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    collections : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "CollectionValue",
      required : true
    },

    category: {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Category",
      required : false
    },

    subCategory : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "SubCategory",
      required : false
    },

    brand: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator(value) {
          return value == null || value <= this.price;
        },
        message: "Discount price cannot exceed original price.",
      },
    },

    thumbnail: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    videos: [
      {
        type: String,
      },
    ],

    sizes: [
      {
        type: String,
      },
    ],

    colors: [
      {
        type: String,
      },
    ],

    fabric: {
      type: String,
      trim: true,
      default: "",
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ---------------------------
    // Analytics
    // ---------------------------

    totalSales: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalLikes: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    wishlistCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    popularityScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug
productSchema.pre("save", function () {
  if (!this.slug || this.isModified("productName")) {
    this.slug = slugify(this.productName, {
      lower: true,
      strict: true,
    });
  }
});

// Text Search
productSchema.index({
  productName: "text",
  description: "text",
  category: "text",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;