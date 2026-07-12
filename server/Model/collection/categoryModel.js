const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    collectionName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollectionValue",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index
categorySchema.index(
  {
    collectionName: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);