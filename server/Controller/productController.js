const Product = require("../Model/productModel");
const HTTP_CODES = require("../utils/statusCode");

const productController = {
  create: async (req, res) => {
    try {
      const {
        productName,
        description,
        collections,
        category,
        subcategory,
        brand,
        price,
        discountPrice,
        stock,
        status,
        sizes,
        colors,
        fabric,
      } = req.body;

      // Required field validation
      if (!productName || !description || !collections || !price || !stock) {
        return res.status(HTTP_CODES.VALIDATION_ERROR).json({
          success: false,
          message: "Please fill all required fields.",
        });
      }

      // Check duplicate product
      const isExistProduct = await Product.findOne({ productName });

      if (isExistProduct) {
        return res.status(HTTP_CODES.DUPLICATE_VALUE).json({
          success: false,
          message: "Product already exists.",
        });
      }

      // Uploaded files
      const thumbnail = req.files?.thumbnail
        ? req.files.thumbnail[0].path
        : null;

      const images = req.files?.images
        ? req.files.images.map((file) => file.path)
        : [];

      const videos = req.files?.videos
        ? req.files.videos.map((file) => file.path)
        : [];

      if (!thumbnail) {
        return res.status(HTTP_CODES.VALIDATION_ERROR).json({
          success: false,
          message: "Thumbnail is required.",
        });
      }

      // Create Product
      const newProduct = await Product.create({
        productName,
        description,
        collections,
        category: category || undefined,
        subCategory: subcategory || undefined,
        brand,
        price,
        discountPrice,
        stock,
        status,
        seller: req.user._id,
        sizes,
        colors,
        fabric,
        thumbnail,
        images,
        videos,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Product created successfully.",
        data: newProduct,
      });
    } catch (error) {
      console.error("Create Product Error:", error);
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: `${error.message}\nStack: ${error.stack}`,
      });
    }
  },

  get: async (req, res) => {
    // this is for getting all products of all seller
    try {
      const products = await Product.find().populate(
        "seller",
        "fullname email phone businessName address gstin",
      );

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Products fetched successfully.",
        products,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error while fetching products.",
        error: error.message,
      });
    }
  },

  getMostSold: async (req, res) => {
    try {
      const mostSold = await Product.find({
        status: "active",
        totalSales: { $gt: 0 },
      })
        .sort({ totalSales: -1 }) // Highest sales first
        .limit(10) // Top 10 products
        .populate("seller", "fullname email phone businessName address gstin");

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Most sold products fetched successfully.",
        mostSold,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error while fetching most sold products.",
        error: error.message,
      });
    }
  },

  myProducts: async (req, res) => {
    // this is for fetching product by seller who created
    try {
      const products = await Product.find({
        seller: req.user._id,
      }).populate("seller", "fullname email phone businessName address gstin");

      return res.status(HTTP_CODES.OK).json({
        success: true,
        products,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  // latest arrivals
  getNewArrivals: async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("seller", "fullname email phone businessName address gstin");

    return res.status(HTTP_CODES.OK).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
},

  getFiltered: async (req, res) => {
    try {
      const { collectionSlug, categorySlug, subcategorySlug } = req.query;
      const query = { status: { $ne: "inactive" } };

      const CollectionValue = require("../Model/collection/collectionModel");
      const Category = require("../Model/collection/categoryModel");
      const SubCategory = require("../Model/collection/subCategoryModel");

      if (subcategorySlug) {
        const sub = await SubCategory.findOne({
          $or: [
            { slug: subcategorySlug.toLowerCase() },
            { name: { $regex: new RegExp(`^${subcategorySlug}$`, "i") } },
          ],
        });
        if (sub) {
          query.$or = [{ subCategory: sub._id }, { subcategory: sub._id }];
        } else {
          return res.status(200).json({ success: true, products: [] });
        }
      } else if (categorySlug) {
        const cat = await Category.findOne({
          $or: [
            { slug: categorySlug.toLowerCase() },
            { name: { $regex: new RegExp(`^${categorySlug}$`, "i") } },
          ],
        });
        if (cat) {
          query.category = cat._id;
        } else {
          return res.status(200).json({ success: true, products: [] });
        }
      } else if (collectionSlug) {
        const col = await CollectionValue.findOne({
          $or: [
            { slug: collectionSlug.toLowerCase() },
            { name: { $regex: new RegExp(`^${collectionSlug}$`, "i") } },
          ],
        });
        if (col) {
          query.collections = col._id;
        } else {
          return res.status(200).json({ success: true, products: [] });
        }
      }

      const products = await Product.find(query)
        .populate("seller", "fullname email phone businessName address gstin")
        .populate("collections", "name slug")
        .populate("category", "name slug")
        .populate("subCategory", "name slug");

      return res.status(200).json({
        success: true,
        message: "Filtered products fetched successfully.",
        products,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id)
        .populate("seller", "fullname email phone businessName address gstin")
        .populate("collections", "name slug")
        .populate("category", "name slug")
        .populate("subCategory", "name slug");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Product fetched successfully.",
        product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }

      // Check if logged in user is the owner (seller) or is an admin
      if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "You are not authorized to edit this product." });
      }

      const updateData = { ...req.body };
      if (updateData.category === "") updateData.category = undefined;
      if (updateData.subcategory === "") updateData.subcategory = undefined;
      if (updateData.subCategory === "") updateData.subCategory = undefined;

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      return res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product: updatedProduct,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }

      // Check authorization
      if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "You are not authorized to delete this product." });
      }

      await Product.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = productController;
