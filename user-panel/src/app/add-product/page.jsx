"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  FileSpreadsheet,
  Image,
  Video,
  ChevronDown,
  Check,
  Plus,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { addProduct } from "@/redux/action/productAction";

export default function AddProducts() {
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

  const { collection, categories, subCategories } = useSelector(
    (state) => state.common,
  );

  const initialState = {
    productName: "",
    description: "",
    collections: "",
    category: "",
    subcategory: "",
    brand: "",
    price: "",
    discountPrice: "",
    stock: "",
    status: "",
    sizes: [],
    colors: "",
    thumbnail: "",
    images: [],
    videos: "",
  };

  const [products, setProducts] = useState(initialState);

  // Helper to handle simple text/number inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducts((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper for multi-select size badge handling
  const toggleSize = (size) => {
    setProducts((prev) => {
      const currentSizes = prev.sizes;
      const updatedSizes = currentSizes.includes(size)
        ? currentSizes.filter((s) => s !== size)
        : [...currentSizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await dispatch(addProduct(products))
    } catch (error) {
      console.log("Error while creating product" , error)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 lg:p-12">
      {/* Top Navigation / Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-10">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition duration-205"
        >
          <FileSpreadsheet size={16} />
          <span>Import Excel</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto block lg:grid lg:grid-cols-3 lg:gap-10">
        {/* Left Side: Explanatory Column */}
        <div className="mb-8 lg:mb-0 lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-playfair animate-fade-in">
              Product Information
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
              Provide necessary descriptions, categorizations, pricing
              particulars, and sizes for this catalog entry. Be sure to upload
              high-fidelity image thumbnails and demos.
            </p>
            <div className="mt-8 hidden lg:block border-l-2 border-primary/20 pl-4 space-y-4">
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
        <form className="lg:col-span-2 space-y-8" onSubmit={handleSubmit}>
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
                Product Title
              </label>
              <input
                type="text"
                name="productName"
                value={products.productName}
                onChange={handleInputChange}
                placeholder="Enter product name..."
                className="w-full py-3 px-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm sm:text-base"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Description
              </label>
              <textarea
                rows={5}
                name="description"
                value={products.description}
                onChange={handleInputChange}
                placeholder="Outline product qualities, materials, sizing fit details..."
                className="w-full py-3 px-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm sm:text-base resize-none"
              />
            </div>

            {/* Collection & Category */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Collection
                </label>
                <div className="relative">
                  <select
                    name="collections"
                    value={products.collections}
                    onChange={handleInputChange}
                    className="appearance-none w-full py-3 px-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm cursor-pointer"
                  >
                    <option value="">Select Collection</option>
                    {collection?.map((item) => (
                      <option key={item.id || item} value={item.id || item}>
                        {item.name || item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={products.category}
                    onChange={handleInputChange}
                    className="appearance-none w-full py-3 px-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((item) => (
                      <option key={item.id || item} value={item.id || item}>
                        {item.name || item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Subcategory & Brand */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Subcategory
                </label>
                <div className="relative">
                  <select
                    name="subcategory"
                    value={products.subcategory}
                    onChange={handleInputChange}
                    className="appearance-none w-full py-3 px-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm cursor-pointer"
                  >
                    <option value="">Select Subcategory</option>
                    {subCategories?.map((item) => (
                      <option key={item.id || item} value={item.id || item}>
                        {item.name || item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brand"
                  value={products.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. Nike, Zara, Adidas"
                  className="w-full py-3 px-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm"
                />
              </div>
            </div>

            {/* Price & Discounted Price */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={products.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full py-3 pl-8 pr-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Discounted Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="discountPrice"
                    value={products.discountPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full py-3 pl-8 pr-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition text-gray-800 bg-gray-50/30 text-sm"
                  />
                </div>
              </div>
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
                    {products.sizes.length === 0 ? (
                      <span className="text-gray-400 text-xs sm:text-sm">
                        Choose multiple sizes...
                      </span>
                    ) : (
                      products.sizes.map((size) => (
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
                        const isSelected = products.sizes.includes(size);
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
          </div>

          {/* Card 2: Media uploads */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Media Attachments
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Upload files to display item design visual reviews.
              </p>
            </div>

            {/* Thumbnail Upload Placeholder */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Cover Thumbnail Image
              </label>
              <div className="border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50/50 rounded-2xl p-6 transition text-center cursor-pointer flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 mb-3 shadow-inner">
                  <Image size={22} />
                </div>
                <p className="text-sm font-bold text-gray-700">
                  Click to upload thumbnail
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  PNG, JPG, or WEBP up to 2MB. Recommended: 800x800px
                </p>
              </div>
            </div>

            {/* Multi-images Gallery Upload Placeholder */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex justify-between">
                <span>Gallery Images</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  Maximum 5 images
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="border-2 border-dashed border-gray-200 hover:border-gray-450 hover:bg-gray-50/50 rounded-2xl h-24 sm:h-20 flex flex-col items-center justify-center cursor-pointer transition text-center p-2"
                  >
                    <Plus size={16} className="text-gray-400" />
                    <span className="text-[10px] font-semibold text-gray-400 mt-1">
                      Image {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Upload Placeholder */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Showcase Demonstration Video
              </label>
              <div className="border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50/50 rounded-2xl p-6 transition text-center cursor-pointer flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 mb-3 shadow-inner">
                  <Video size={22} />
                </div>
                <p className="text-sm font-bold text-gray-700">
                  Click to upload product video
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  MP4, WEBM format up to 20MB. Max duration: 30s
                </p>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-gray-950 text-white font-bold rounded-2xl transition duration-200 text-sm shadow-md hover:shadow-lg focus:ring-2 focus:ring-black/20"
            >
              Add Product Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}