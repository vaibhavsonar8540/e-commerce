"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Undo2, X, MoreVertical, Edit2, Trash2 } from "lucide-react";
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

  // Form Field States
  const [selectCollId, setSelectCollId] = useState("");
  const [selectCatId, setSelectCatId] = useState("");
  const [subCatName, setSubCatName] = useState("");
  const [editingSub, setEditingSub] = useState(null);

const filteredCategories = categories.filter(
  (cat) => cat.collectionName?._id === selectCollId
);

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
        order: subCategories.length + 1
      };
      
      await dispatch(createSubCategoryAction(payload));

      toast("Sub category created successfully")
      
      // Reset local state fields and close modal
      setSubCatName("");
      setSelectCatId("");
      setSelectCollId("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating subcategory:", error);
    }
  };


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

        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm">
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
            placeholder="Search subcategory..."
            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-sm h-[calc(100vh-240px)] min-h-[400px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              <th className="p-4 w-20">#</th>
              <th className="p-4">Sub-Category Name</th>
              <th className="p-4">Category Name</th>
              <th className="p-4">Collection Name</th>
              <th className="p-4 w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((sub, index) => (
              <tr key={sub._id} className="border-t border-t-gray-300 relative">
                <td className="p-4 text-gray-600">{index + 1}</td>
                <td className="p-4 font-medium text-gray-800">{sub.name}</td>
                <td className="p-4 text-gray-600">{sub.category?.name || sub.categoryName}</td>
                <td className="p-4 text-gray-600">{sub.category?.collectionName?.name || sub.collectionName}</td>
                <td className="p-4 text-center relative overflow-visible">
                  <button onClick={() => setActiveMenuId(activeMenuId === sub._id ? null : sub._id)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative mx-4">
            <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X size={22} /></button>
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
                  {filteredCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category Name</label>
                <input type="text" placeholder="Sub-Category Name" value={subCatName} onChange={(e) => setSubCatName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black" required />
              </div>

              <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 shadow-md">Create SubCategory</button>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {/* {isEditOpen && editingSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative mx-4">
            <button onClick={() => setIsEditOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X size={22} /></button>
            <div className="text-center mt-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Update SubCategory</h2>
            </div>
            <form onSubmit={handleUpdateSub} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
                <select value={editingSub.collectionId} onChange={(e) => setEditingSub({ ...editingSub, collectionId: e.target.value, categoryId: "" })} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-black" required>
                  {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={editingSub.categoryId} onChange={(e) => setEditingSub({ ...editingSub, categoryId: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-black" required>
                  <option value="">-- Choose Category --</option>
                  {categories.filter(cat => cat.collectionId === parseInt(editingSub.collectionId)).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category Name</label>
                <input type="text" value={editingSub.name} onChange={(e) => setEditingSub({ ...editingSub, name: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black" required />
              </div>

              <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 shadow-md">Save Changes</button>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
}