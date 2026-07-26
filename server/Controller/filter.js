const User = require("../Model/userModel");
const Product = require("../Model/productModel");
const CollectionValue = require("../Model/collection/collectionModel");
const categoryModel = require("../Model/collection/categoryModel");
const SubcategoriesModel = require("../Model/collection/categoryModel")


const filterController = {
  // 1. Search User by Email
  searchUserByEmail: async (req, res) => {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email query param is required."
        });
      }

      // Perform a case-insensitive regex search for users matching the email pattern
      const users = await User.find({
        email: { $regex: email, $options: "i" }
      }).select("-password"); // Exclude secret info like password hash

      return res.status(200).json({
        success: true,
        count: users.length,
        users
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message
      });
    }
  },

  // 2. Search Product by Name, Collection, Category, and Subcategory
  searchProduct: async (req, res) => {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query param is required."
        });
      }

      const matchRegex = { $regex: query, $options: "i" };

      // Look up matching Collections
      const matchingCollections = await CollectionValue.find({ name: matchRegex });
      const collectionIds = matchingCollections.map(c => c._id);

      // Look up matching Categories
      const matchingCategories = await categoryModel.find({ name: matchRegex });
      const categoryIds = matchingCategories.map(c => c._id);

      // Look up matching Subcategories
      const matchingSubCategories = await SubcategoriesModel.find({ name: matchRegex });
      const subCategoryIds = matchingSubCategories.map(sc => sc._id);

      // Match products where product name matches or any of the foreign keys point to matched categories/collections
      const products = await Product.find({
        $or: [
          { productName: matchRegex },
          { collections: { $in: collectionIds } },
          { category: { $in: categoryIds } },
          { subCategory: { $in: subCategoryIds } }
        ]
      })
      .populate("collections", "name slug")
      .populate("category", "name slug")
      .populate("subCategory", "name slug");

      return res.status(200).json({
        success: true,
        count: products.length,
        products
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message
      });
    }
  },

  // 3. Get Latest Arrivals for specified collections
  getLatestArrivalsByCollections: async (req, res) => {
    try {
      const slugs = ["women", "men", "kids", "home-and-kitchen", "watches", "electronics"];
      const results = {};

      const collections = await CollectionValue.find({ slug: { $in: slugs } });
      const collectionMap = {};
      collections.forEach(col => {
        collectionMap[col.slug] = col._id;
      });

      await Promise.all(
        slugs.map(async (slug) => {
          const colId = collectionMap[slug];
          if (!colId) {
            results[slug] = [];
            return;
          }
          results[slug] = await Product.find({
            collections: colId,
            status: "active"
          })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("seller", "fullname email phone businessName address gstin")
            .populate("collections", "name slug")
            .populate("category", "name slug")
            .populate("subCategory", "name slug");
        })
      );

      return res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching latest arrivals by collections.",
        error: error.message
      });
    }
  }
};

module.exports = filterController;
