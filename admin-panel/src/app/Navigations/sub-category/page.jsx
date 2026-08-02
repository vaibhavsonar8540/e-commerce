"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Undo2, X, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollection, fetchCategories, fetchSUbCategories, createSubCategoryAction } from "@/redux/action/commonAction";
import { toast } from "react-toastify";

export default function SubCategory() {
  const dispatch = useDispatch();
  
  // Fetch real data arrays out of global Redux state
  const { collection = [], categories = [], subCategories = [] } = useSelector((state) => state.common);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Pagination & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Form Field States
  const [selectCollId, setSelectCollId] = useState("");
  const [selectCatId, setSelectCatId] = useState("");
  const [subCatName, setSubCatName] = useState("");
  const [editingSub, setEditingSub] = useState(null);

  const filteredCategoriesForModal = categories.filter(
    (cat) => cat.collectionName?._id === selectCollId
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Fetch collections, categories, and subcategories on mount
  useEffect(() => {
    dispatch(fetchCollection());
    dispatch(fetchCategories());
    dispatch(fetchSUbCategories());
  }, [dispatch]);

  const handleCreateSub = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: subCatName,
        categoryId: selectCatId,
        order: (subCategories?.length || 0) + 1
      };
      
      await dispatch(createSubCategoryAction(payload));

      toast("Sub category created successfully");
      
      // Reset local state fields and close modal
      setSubCatName("");
      setSelectCatId("");
      setSelectCollId("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating subcategory:", error);
    }
  };

  // Filtered & Paginated items
  const filteredSubCategories = (subCategories || []).filter((item) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = item.name?.toLowerCase().includes(query);
    const catMatch = (item.category?.name || item.categoryName || "")?.toLowerCase().includes(query);
    const colMatch = (item.category?.collectionName?.name || item.collectionName || "")?.toLowerCase().includes(query);
    return nameMatch || catMatch || colMatch;
  });

  const totalPages = Math.ceil(filteredSubCategories.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSubCategories = filteredSubCategories.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
            <Undo2 size={20} />
          </Link>
          <h1 className="text-3xl font-bold uppercase">Sub-Categories</h1>
        </div>

        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer">
          <Plus size={18} />
          <span>SubCategory</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-4 items-center mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search subcategory, category or collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
        <div className="max-h-[calc(100vh-320px)] min-h-[350px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-100 z-10 border-b border-gray-200">
              <tr>
                <th className="p-4 w-20 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sub-Category Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Collection Name</th>
                <th className="p-4 w-20 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedSubCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                    {searchQuery ? "No matching sub-categories found." : 'No sub-categories found. Click "SubCategory" above to create one!'}
                  </td>
                </tr>
              ) : (
                paginatedSubCategories.map((sub, index) => (
                  <tr key={sub._id || index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-gray-500 font-medium">{startIndex + index + 1}</td>
                    <td className="p-4 font-semibold text-gray-800">{sub.name}</td>
                    <td className="p-4 text-gray-600">{sub.category?.name || sub.categoryName || "-"}</td>
                    <td className="p-4 text-gray-600">{sub.category?.collectionName?.name || sub.collectionName || "-"}</td>
                    <td className="p-4 text-center relative">
                      <button onClick={() => setActiveMenuId(activeMenuId === sub._id ? null : sub._id)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuId === sub._id && (
                        <div className="absolute right-4 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1">
                          <button onClick={() => { setEditingSub(sub); setIsEditOpen(true); setActiveMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Edit2 size={14} /> Update
                          </button>
                          <button onClick={() => handleDeleteSub(sub._id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 font-medium">
            Showing {filteredSubCategories.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredSubCategories.length)} of{" "}
            {filteredSubCategories.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative mx-4">
            <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"><X size={22} /></button>
            <div className="text-center mt-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Create SubCategory</h2>
            </div>
            <form onSubmit={handleCreateSub} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Collection</label>
                <select value={selectCollId} onChange={(e) => { setSelectCollId(e.target.value); setSelectCatId(""); }} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-black" required>
                  <option value="">-- Choose Collection --</option>
                  {collection.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
                <select value={selectCatId} onChange={(e) => setSelectCatId(e.target.value)} disabled={!selectCollId} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-black disabled:bg-gray-100" required>
                  <option value="">-- Choose Category --</option>
                  {filteredCategoriesForModal.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category Name</label>
                <input type="text" placeholder="Sub-Category Name" value={subCatName} onChange={(e) => setSubCatName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black" required />
              </div>

              <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 shadow-md cursor-pointer">Create SubCategory</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}