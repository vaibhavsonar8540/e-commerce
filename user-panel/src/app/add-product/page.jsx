"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/axiosInstant";
import {
  ArrowLeft,
  Image,
  Video,
  ChevronDown,
  Check,
  Plus,
  X,
  AlertCircle,
  Package,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addProduct } from "@/redux/action/productAction";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Link from "next/link";
import { setIsModelOpen } from "@/redux/slices/commonSlice";

export default function AddProducts() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

  const { collection, categories, subCategories } = useSelector(
    (state) => state.common,
  );

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    productName: Yup.string()
      .trim()
      .min(3, "Product name must be at least 3 characters")
      .max(150, "Product name cannot exceed 150 characters")
      .required("Product title is required"),
    description: Yup.string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .required("Description is required"),
    collections: Yup.string().required("Collection selection is required"),
    category: Yup.string().optional(),
    subcategory: Yup.string().optional(),
    brand: Yup.string().optional(),
    price: Yup.number()
      .typeError("Price must be a number")
      .min(0, "Price cannot be negative")
      .required("Price is required"),
    discountPrice: Yup.number()
      .typeError("Discount price must be a number")
      .min(0, "Discount price cannot be negative")
      .test(
        "discountPrice-validation",
        "Discount price cannot exceed original price",
        function (value) {
          const { price } = this.parent;
          return value === undefined || value === null || value === "" || value <= price;
        }
      ),
    stock: Yup.number()
      .typeError("Stock must be a number")
      .min(0, "Stock cannot be negative")
      .required("Stock is required"),
    sizes: Yup.array().of(Yup.string()).optional(),
    colors: Yup.string().optional(),
    fabric: Yup.string().optional(),
    thumbnail: Yup.mixed().required("Cover thumbnail image is required"),
    images: Yup.array().max(5, "You can upload up to 5 images").optional(),
    videos: Yup.mixed().nullable().optional(),
  });

  const formik = useFormik({
    initialValues: {
      productName: "",
      description: "",
      collections: "",
      category: "",
      subcategory: "",
      brand: "",
      price: "",
      discountPrice: "",
      stock: "",
      status: "active",
      sizes: [],
      colors: "",
      fabric: "",
      thumbnail: null,
      images: [],
      videos: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("productName", values.productName);
        formData.append("description", values.description);
        formData.append("collections", values.collections);
        if (values.category) formData.append("category", values.category);
        if (values.subcategory) formData.append("subcategory", values.subcategory);
        if (values.brand) formData.append("brand", values.brand);
        if (values.fabric) formData.append("fabric", values.fabric);
        formData.append("price", values.price);
        if (values.discountPrice !== "" && values.discountPrice !== null && values.discountPrice !== undefined) {
          formData.append("discountPrice", values.discountPrice);
        }
        formData.append("stock", values.stock);
        formData.append("status", values.status);

        // Append sizes
        if (values.sizes && values.sizes.length > 0) {
          values.sizes.forEach((size) => formData.append("sizes", size));
        }

        // Parse and append colors
        if (values.colors) {
          const colorArray = values.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
          colorArray.forEach((color) => formData.append("colors", color));
        }

        // Media files
        if (values.thumbnail) {
          formData.append("thumbnail", values.thumbnail);
        }
        if (values.images && values.images.length > 0) {
          values.images.forEach((imgFile) => {
            formData.append("images", imgFile);
          });
        }
        if (values.videos) {
          formData.append("videos", values.videos);
        }

        const data = await dispatch(addProduct(formData));
        if (data && data.success) {
          toast.success(data.message || "Product created successfully!");
          resetForm();
          // Reset file preview states
          setThumbnailPreview(null);
          setImagesPreviews([]);
          setVideoPreview(null);
        } else {
          toast.error(data?.message || "Failed to create product.");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || "Something went wrong.");
      }
    },
  });

  // Fetch categories when collections selection changes
  useEffect(() => {
    if (formik.values.collections) {
      api.get(`/collection/categories?collectionId=${formik.values.collections}`)
        .then((res) => {
          setFilteredCategories(res.data.categories || []);
          formik.setFieldValue("category", "");
          formik.setFieldValue("subcategory", "");
        })
        .catch((err) => {
          setFilteredCategories([]);
        });
    } else {
      setFilteredCategories([]);
      formik.setFieldValue("category", "");
      formik.setFieldValue("subcategory", "");
    }
  }, [formik.values.collections]);

  // Fetch subcategories when category selection changes
  useEffect(() => {
    if (formik.values.category) {
      api.get(`/collection/sub-categories?categoryId=${formik.values.category}`)
        .then((res) => {
          setFilteredSubcategories(res.data.subCategories || []);
          formik.setFieldValue("subcategory", "");
        })
        .catch((err) => {
          setFilteredSubcategories([]);
        });
    } else {
      setFilteredSubcategories([]);
      formik.setFieldValue("subcategory", "");
    }
  }, [formik.values.category]);

  // Size selection handling
  const toggleSize = (size) => {
    const currentSizes = formik.values.sizes;
    const updatedSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    formik.setFieldValue("sizes", updatedSizes);
  };

  // Thumbnail file change handler
  const handleThumbnailChange = (e) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("thumbnail", file);
      setThumbnailPreview(URL.createObjectURL(file));
      formik.setFieldTouched("thumbnail", true, false);
    }
  };

  // Gallery multi-images handler
  const handleGalleryChange = (e) => {
    const files = Array.from(e.currentTarget.files || []);
    const currentFiles = formik.values.images;
    const newFiles = [...currentFiles, ...files].slice(0, 5); // Limit max 5
    formik.setFieldValue("images", newFiles);

    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setImagesPreviews(previews);
  };

  // Remove individual gallery image
  const removeGalleryImage = (index) => {
    const currentFiles = formik.values.images;
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    formik.setFieldValue("images", updatedFiles);

    const previews = updatedFiles.map((file) => URL.createObjectURL(file));
    setImagesPreviews(previews);
  };

  // Video showcase handler
  const handleVideoChange = (e) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("videos", file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Remove video showcase
  const handleRemoveVideo = () => {
    formik.setFieldValue("videos", null);
    setVideoPreview(null);
  };

  // Auth & Role Guard
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/30">
        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
        <p className="text-sm font-semibold text-gray-500 mt-3">Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/30 p-4">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-8 max-w-md w-full text-center shadow-sm space-y-6">
          <div className="w-16 h-16 bg-[#f9ece5] text-black rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Package size={28} />
          </div>
          <h2 className="text-2xl font-bold font-playfair text-black">Access Vendor Portal</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Please login as an Admin or Seller to view, manage, and track your active product listings.
          </p>
          <div>
            <button
              onClick={() => dispatch(setIsModelOpen(true))}
              type="button"
              className="w-full py-3 bg-black hover:bg-gray-950 text-white font-bold rounded-2xl transition duration-200 outline-none text-sm cursor-pointer shadow-md hover:shadow-lg"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== "seller" && user?.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/30 p-4">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-8 max-w-md w-full text-center shadow-sm space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-2xl font-bold font-playfair text-red-800">Unauthorised Access</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Only accounts registered as <strong>Sellers</strong> or <strong>Admins</strong> are authorised to list products and access this catalog.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex w-full justify-center py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-2xl transition duration-200 text-sm shadow-md"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 lg:p-12">
      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto block lg:grid lg:grid-cols-3 lg:gap-10 pt-4">
        {/* Left Side: Explanatory Column */}
        <div className="mb-8 lg:mb-0 lg:col-span-1">
          <div className="lg:sticky lg:top-28 space-y-6">
            {/* Top Navigation / Actions */}
            <div>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black bg-transparent transition cursor-pointer py-1"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-playfair">
                Product Information
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
                Provide necessary descriptions, categorizations, pricing
                particulars, and sizes for this catalog entry. Be sure to upload
                high-fidelity image thumbnails and demos.
              </p>
            </div>
            
            <div className="mt-8 hidden lg:block border-l-2 border-black/10 pl-4 space-y-4">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-gray-400">
                  Step 1: Details
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Specify basic names, price structure, collection types,
                  categories, and sizing catalogs.
                </p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-gray-400">
                  Step 2: Media
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Upload a crisp cover thumbnail, up to 5 gallery showcase
                  pictures, and a brief video review.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Containment */}
        <form className="lg:col-span-2 space-y-6" onSubmit={formik.handleSubmit}>
          {/* Card 1: Product Specifications */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Basic Attributes
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Fields marked with borders are editable specifications.
              </p>
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productName"
                value={formik.values.productName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter product name..."
                className={`w-full py-3 px-4 border rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm sm:text-base ${
                  (formik.touched.productName || formik.submitCount > 0) && formik.errors.productName
                    ? "border-red-400 focus:border-red-500 bg-red-50/10"
                    : "border-gray-200"
                }`}
              />
              {(formik.touched.productName || formik.submitCount > 0) && formik.errors.productName && (
                <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{formik.errors.productName}</span>
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Outline product qualities, materials, sizing fit details..."
                className={`w-full py-3 px-4 border rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm sm:text-base resize-none ${
                  (formik.touched.description || formik.submitCount > 0) && formik.errors.description
                    ? "border-red-400 focus:border-red-500 bg-red-50/10"
                    : "border-gray-200"
                }`}
              />
              {(formik.touched.description || formik.submitCount > 0) && formik.errors.description && (
                <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{formik.errors.description}</span>
                </p>
              )}
            </div>

            {/* Collection & Category */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Collection */}
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Collection <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="collections"
                    value={formik.values.collections}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`appearance-none w-full py-3 px-4 border rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm cursor-pointer ${
                      (formik.touched.collections || formik.submitCount > 0) && formik.errors.collections
                        ? "border-red-400 focus:border-red-500 bg-red-50/10"
                        : "border-gray-200"
                    }`}
                  >
                    <option value="">Select Collection</option>
                    {collection?.map((item) => (
                      <option key={item._id || item.id || item} value={item._id || item.id || item}>
                        {item.name || item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                </div>
                {(formik.touched.collections || formik.submitCount > 0) && formik.errors.collections && (
                  <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{formik.errors.collections}</span>
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center justify-between">
                  <span>Category <span className="text-gray-400 font-normal text-[11px] lowercase">(optional)</span></span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`appearance-none w-full py-3 px-4 border rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm cursor-pointer ${
                      (formik.touched.category || formik.submitCount > 0) && formik.errors.category
                        ? "border-red-400 focus:border-red-500 bg-red-50/10"
                        : "border-gray-200"
                    }`}
                  >
                    <option value="">Select Category</option>
                    {filteredCategories?.map((item) => (
                      <option key={item._id || item.id || item} value={item._id || item.id || item}>
                        {item.name || item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                </div>
                {(formik.touched.category || formik.submitCount > 0) && formik.errors.category && (
                  <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{formik.errors.category}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Subcategory & Brand */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Subcategory */}
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center justify-between">
                  <span>Subcategory <span className="text-gray-400 font-normal text-[11px] lowercase">(optional)</span></span>
                </label>
                <div className="relative">
                  <select
                    name="subcategory"
                    value={formik.values.subcategory}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`appearance-none w-full py-3 px-4 border rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm cursor-pointer ${
                      (formik.touched.subcategory || formik.submitCount > 0) && formik.errors.subcategory
                        ? "border-red-400 focus:border-red-500 bg-red-50/10"
                        : "border-gray-200"
                    }`}
                  >
                    <option value="">Select Subcategory</option>
                    {filteredSubcategories?.map((item) => (
                      <option key={item._id || item.id || item} value={item._id || item.id || item}>
                        {item.name || item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                </div>
                {(formik.touched.subcategory || formik.submitCount > 0) && formik.errors.subcategory && (
                  <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{formik.errors.subcategory}</span>
                  </p>
                )}
              </div>

              {/* Brand */}
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center justify-between">
                  <span>Brand Name <span className="text-gray-400 font-normal text-[11px] lowercase">(optional)</span></span>
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formik.values.brand}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Nike, Zara, Adidas"
                  className="w-full py-3 px-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm font-semibold"
                />
              </div>
            </div>

            {/* Price & Discounted Price */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Price */}
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="0.00"
                    className={`w-full py-3 pl-8 pr-4 border rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm ${
                      (formik.touched.price || formik.submitCount > 0) && formik.errors.price
                        ? "border-red-400 focus:border-red-500 bg-red-50/10"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {(formik.touched.price || formik.submitCount > 0) && formik.errors.price && (
                  <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{formik.errors.price}</span>
                  </p>
                )}
              </div>

              {/* Discount price */}
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center justify-between">
                  <span>Discounted Price <span className="text-gray-400 font-normal text-[11px] lowercase">(optional)</span></span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formik.values.discountPrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="0.00"
                    className={`w-full py-3 pl-8 pr-4 border rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm ${
                      (formik.touched.discountPrice || formik.submitCount > 0) && formik.errors.discountPrice
                        ? "border-red-400 focus:border-red-500 bg-red-50/10"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {(formik.touched.discountPrice || formik.submitCount > 0) && formik.errors.discountPrice && (
                  <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{formik.errors.discountPrice}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter stock quantity..."
                className={`w-full py-3 px-4 border rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm ${
                  (formik.touched.stock || formik.submitCount > 0) && formik.errors.stock
                    ? "border-red-400 focus:border-red-500 bg-red-50/10"
                    : "border-gray-200"
                }`}
              />
              {(formik.touched.stock || formik.submitCount > 0) && formik.errors.stock && (
                <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{formik.errors.stock}</span>
                </p>
              )}
            </div>

            {/* Sizes Multi-Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Select Sizes
              </label>
              <div className="relative">
                <div
                  onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                  className="w-full min-h-[46px] py-2 px-4 border border-gray-200 rounded-2xl text-left bg-gray-50/30 flex items-center justify-between cursor-pointer focus:border-black select-none text-sm"
                >
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {formik.values.sizes.length === 0 ? (
                      <span className="text-gray-400 text-xs sm:text-sm">
                        Choose multiple sizes...
                      </span>
                    ) : (
                      formik.values.sizes.map((size) => (
                        <span
                          key={size}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSize(size);
                          }}
                          className="bg-black text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-red-700 transition"
                        >
                          {size}
                          <X size={10} />
                        </span>
                      ))
                    )}
                  </div>
                  <ChevronDown className="text-gray-400 w-4 h-4 ml-2 flex-shrink-0" />
                </div>

                {sizeDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSizeDropdownOpen(false)}
                    />
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 max-h-52 overflow-y-auto p-2">
                      {availableSizes.map((size) => {
                        const isSelected = formik.values.sizes.includes(size);
                        return (
                          <div
                            key={size}
                            onClick={() => toggleSize(size)}
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer text-sm font-semibold text-gray-700 select-none"
                          >
                            <span>{size}</span>
                            {isSelected && (
                              <Check size={16} className="text-black" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Colors Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Colors (comma-separated list)
              </label>
              <input
                type="text"
                name="colors"
                value={formik.values.colors}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Red, Blue, Black, White"
                className="w-full py-3 px-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm font-semibold"
              />
            </div>

            {/* Fabric Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Fabric Type
              </label>
              <input
                type="text"
                name="fabric"
                value={formik.values.fabric}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Cotton, Silk, Rayon, Polyester"
                className="w-full py-3 px-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm font-semibold"
              />
            </div>
          </div>

          {/* Card 2: Media uploads */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Media Attachments
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Upload cover thumbnail (required) and optional gallery pictures or video.
              </p>
            </div>

            {/* Thumbnail Upload & Preview */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex justify-between">
                <span>
                  Cover Thumbnail Image <span className="text-red-500">*</span>
                </span>
              </label>

              {thumbnailPreview ? (
                <div className="relative w-full h-64 border border-gray-200 rounded-2xl overflow-hidden group shadow-sm">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailPreview(null);
                        formik.setFieldValue("thumbnail", null);
                        formik.setFieldTouched("thumbnail", true, false);
                      }}
                      className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md hover:scale-105 transition cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  className={`border-2 border-dashed rounded-2xl p-6 transition text-center cursor-pointer flex flex-col items-center justify-center select-none ${
                    (formik.touched.thumbnail || formik.submitCount > 0) && formik.errors.thumbnail
                      ? "border-red-400 bg-red-50/20"
                      : "border-gray-200 hover:border-gray-400 hover:bg-gray-50/50"
                  }`}
                >
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 mb-3 shadow-inner">
                    <Image size={22} />
                  </div>
                  <p className="text-sm font-bold text-gray-700">
                    Click to upload thumbnail
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    PNG, JPG, or WEBP up to 2MB. Recommended: 800x800px
                  </p>
                </label>
              )}
              {(formik.touched.thumbnail || formik.submitCount > 0) && formik.errors.thumbnail && (
                <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{formik.errors.thumbnail}</span>
                </p>
              )}
            </div>

            {/* Multi-images Gallery Upload & Previews */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex justify-between">
                <span>
                  Gallery Images <span className="text-gray-400 font-normal text-[11px] lowercase">(optional)</span>
                </span>
                <span className="text-[10px] text-gray-400 font-normal">
                  Maximum 5 images ({formik.values.images.length}/5 uploaded)
                </span>
              </label>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                {/* Render Uploaded Image Previews */}
                {imagesPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-200 rounded-2xl h-24 sm:h-20 overflow-hidden group shadow-sm"
                  >
                    <img
                      src={preview}
                      alt={`Gallery Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="p-1 px-1.5 bg-red-600 text-white rounded-lg hover:bg-red-750 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Render Empty/Upload Slots if under 5 items */}
                {formik.values.images.length < 5 && (
                  <label className="border-2 border-dashed border-gray-200 hover:border-gray-450 hover:bg-gray-50/50 rounded-2xl h-24 sm:h-20 flex flex-col items-center justify-center cursor-pointer transition text-center p-2 select-none">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryChange}
                      className="hidden"
                    />
                    <Plus size={16} className="text-gray-400" />
                    <span className="text-[10px] font-semibold text-gray-400 mt-1">
                      Upload
                    </span>
                  </label>
                )}

                {/* Fill remaining slots to maintain layout (from list of 5 slots) */}
                {[...Array(Math.max(0, 5 - formik.values.images.length - (formik.values.images.length < 5 ? 1 : 0)))].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-100 bg-gray-50/20 rounded-2xl h-24 sm:h-20 flex flex-col items-center justify-center opacity-50 select-none pointer-events-none"
                  >
                    <span className="text-[10px] font-semibold text-gray-300">
                      Empty Slot
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Upload & Preview */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center justify-between">
                <span>Showcase Video <span className="text-gray-400 font-normal text-[11px] lowercase">(optional)</span></span>
              </label>

              {videoPreview ? (
                <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-80 object-contain bg-black"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 group-hover:bg-red-650 rounded-full p-2 transition">
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="text-white hover:scale-105 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50/50 rounded-2xl p-6 transition text-center cursor-pointer flex flex-col items-center justify-center select-none">
                  <input
                    type="file"
                    name="videos"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 mb-3 shadow-inner">
                    <Video size={22} />
                  </div>
                  <p className="text-sm font-bold text-gray-700">
                    Click to upload product video
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    MP4, WEBM format up to 20MB. Max duration: 30s
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-gray-950 disabled:bg-gray-400 text-white font-bold rounded-2xl transition duration-200 text-sm shadow-md hover:shadow-lg focus:ring-2 focus:ring-black/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving entry...</span>
                </>
              ) : (
                <span>Add Product Catalog</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}