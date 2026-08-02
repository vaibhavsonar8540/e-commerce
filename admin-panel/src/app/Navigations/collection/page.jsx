"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Undo2,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollection, createCollection } from "@/redux/action/commonAction";
import { setIsModelOpen } from "@/redux/slices/commonSlice";
import { toast } from "react-toastify";

export default function Collection() {
  const { collection, isModelOpen } = useSelector((state) => state.common);
  const dispatch = useDispatch();

  const [collectionData, setCollectionData] = useState({
    name: "",
    order: (collection?.length || 0) + 1,
  });
  
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Pagination & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCollectionData((prev) => ({
      ...prev,
      order: (collection?.length || 0) + 1,
    }));
  }, [collection]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!collectionData.name.trim()) return;

    try {
      await dispatch(createCollection(collectionData));
      
      setCollectionData({
        name: "",
        order: (collection?.length || 0) + 1,
      });
      
      dispatch(setIsModelOpen(false));
      toast.success("Collection Created Successfully");
    } catch (error) {
      console.error("Error while creating collection:", error);
    }
  };

  const getCollectionData = async () => {
    try {
      await dispatch(fetchCollection());
    } catch (error) {
      console.error("Error while fetching collection data:", error);
    }
  };

  useEffect(() => {
    getCollectionData();
  }, []);

  // Filtered & Paginated items
  const filteredCollections = (collection || []).filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCollections.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCollections = filteredCollections.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200"
          >
            <Undo2 size={20} />
          </Link>
          <h1 className="text-3xl font-bold uppercase">Collections</h1>
        </div>

        <button
          onClick={() => dispatch(setIsModelOpen(true))}
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} />
          <span>Collection</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-4 items-center mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search collection by name..."
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
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Collection Name</th>
                <th className="p-4 w-20 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedCollections.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400 font-medium">
                    {searchQuery ? "No matching collections found." : 'No collections found. Click "Collection" above to create one!'}
                  </td>
                </tr>
              ) : (
                paginatedCollections.map((item, index) => (
                  <tr
                    key={item._id || item.id || index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 text-gray-500 font-medium">{startIndex + index + 1}</td>
                    <td className="p-4 font-semibold text-gray-800">
                      {item.name}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                      >
                        <MoreVertical size={18} />
                      </button>
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
            Showing {filteredCollections.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredCollections.length)} of{" "}
            {filteredCollections.length} entries
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
      {isModelOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative mx-4">
            <button
              onClick={() => dispatch(setIsModelOpen(false))}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={22} />
            </button>
            <div className="text-center mt-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Create New Collection
              </h2>
            </div>
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <input
                type="text"
                placeholder="Collection Name"
                value={collectionData.name}
                onChange={(e) => setCollectionData({ ...collectionData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                required
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 shadow-md cursor-pointer"
              >
                Create Collection
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}