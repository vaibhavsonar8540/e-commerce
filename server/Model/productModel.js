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
    }, // is used for convert id to product name ex - product/6523s65s2f232 -> slug -> product/i-phone

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Fashion",
        "Home",
        "Beauty",
        "Sports",
      ],
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
  },
  {
    timestamps: true,
  }
);

// Automatically generate slug
productSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("productName")) {
    this.slug = slugify(this.productName, {
      lower: true,
      strict: true,
    });
  }

  next();
});

// Text Search Index
productSchema.index({
  productName: "text",
  description: "text",
  category: "text",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;