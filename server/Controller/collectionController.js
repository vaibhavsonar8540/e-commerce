const SubCategory = require("../Model/collection/subCategoryModel");
const slugify = require("slugify");
const HTTP_CODES = require("../utils/statusCode");
const CollectionValue = require("../Model/collection/collectionModel");
const category = require("../Model/collection/categoryModel");
const subCategory = require("../Model/collection/subCategoryModel");

const collectionController = {
  // CREATE Collection
  createCollection: async (req, res) => {
    try {
      const { name, order } = req.body;

      if (!name) {
        return res.status(HTTP_CODES.VALIDATION_ERROR).json({
          success: false,
          message: "Collection name is required.",
        });
      }

      const existingCollection = await CollectionValue.findOne({ name });
      if (existingCollection) {
        return res.status(HTTP_CODES.DUPLICATE_VALUE).json({
          success: false,
          message: "Collection already exists.",
        });
      }

      const slug = slugify(name, { lower: true });

      const newCollection = await CollectionValue.create({
        name,
        slug,
        order: order || 0,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Collection created successfully.",
        collection: newCollection,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  // CREATE Category
  createCategory: async (req, res) => {
    try {
      const { name, collectionId, order } = req.body;

      if (!name || !collectionId) {
        return res.status(HTTP_CODES.VALIDATION_ERROR).json({
          success: false,
          message: "Category name and collection ID are required.",
        });
      }

      // Check if collection exists
      const collectionExists = await CollectionValue.findById(collectionId);
      if (!collectionExists) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: "Associated Collection not found.",
        });
      }

      const existingCategory = await category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        collectionName: collectionId,
      });
      if (existingCategory) {
        return res.status(HTTP_CODES.DUPLICATE_VALUE).json({
          success: false,
          message: "Category already exists in this collection.",
        });
      }

      const slug = slugify(name, { lower: true });

      const newCategory = await category.create({
        collectionName: collectionId,
        name,
        slug,
        order: order || 0,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Category created successfully.",
        category: newCategory,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  // CREATE SubCategory
  createSubCategory: async (req, res) => {
    try {
      const { name, categoryId, order } = req.body;

      if (!name || !categoryId) {
        return res.status(HTTP_CODES.VALIDATION_ERROR).json({
          success: false,
          message: "Subcategory name and category ID are required.",
        });
      }

      // Check if category exists
      const categoryExists = await category.findById(categoryId);
      if (!categoryExists) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: "Associated Category not found.",
        });
      }

      const existingSubCategory = await subCategory.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        category: categoryId,
      });
      if (existingSubCategory) {
        return res.status(HTTP_CODES.DUPLICATE_VALUE).json({
          success: false,
          message: "Subcategory already exists in this category.",
        });
      }

      const slug = slugify(name, { lower: true });

      const newSubCategory = await subCategory.create({
        category: categoryId,
        name,
        slug,
        order: order || 0,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Subcategory created successfully.",
        subCategory: newSubCategory,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET Collections
  getCollections: async (req, res) => {
    try {
      const collections = await CollectionValue.find().sort({ order: 1 });
      return res.status(HTTP_CODES.OK).json({
        success: true,
        collections,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET Categories (optional filter by collectionId)
  getCategories: async (req, res) => {
    try {
      const { collectionId } = req.query;
      const query = {};
      if (collectionId) {
        query.collectionName = collectionId;
      }

      const categories = await category
        .find(query)
        .populate("collectionName", "name slug")
        .sort({ order: 1 });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        categories,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET SubCategories (optional filter by categoryId)
  getSubCategories: async (req, res) => {
    try {
      const { categoryId } = req.query;
      const query = {};
      if (categoryId) {
        query.category = categoryId;
      }

      const subCategories = await subCategory
        .find(query)
        .populate({
          path: "category",
          select: "name slug collection",
          populate: { path: "collectionName", select: "name slug" },
        })
        .sort({ order: 1 });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        subCategories,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = collectionController;
