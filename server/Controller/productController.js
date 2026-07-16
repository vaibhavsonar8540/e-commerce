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
        category,
        subcategory,
        brand,
        price,
        discountPrice,
        stock,
        status,
        seller: req.user._id,
        sizes,
        colors,
        thumbnail,
        images,
        videos,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Product created successfully.",
        product: newProduct,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  get: async (req, res) => {
    // this is for getting all products of all seller
    try {
      const products = await Product.find().populate(
        "seller",
        "fullname email",
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
        .populate("seller", "fullname email");

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
      }).populate("seller", "fullname email");

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
      .populate("seller", "fullname email");

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
};

module.exports = productController;
