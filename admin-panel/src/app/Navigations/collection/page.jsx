"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Undo2,
  X,
  MoreVertical,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollection, createCollection } from "@/redux/action/commonAction";
import { setIsModelOpen } from "@/redux/slices/commonSlice";
import { toast } from "react-toastify";

export default function Collection() {
  const { collection, isModelOpen } = useSelector((state) => state.common);
  const dispatch = useDispatch();

  // 1. Initialize state directly using the collection length cleanly
  const [collectionData, setCollectionData] = useState({
    name: "",
    order: (collection?.length || 0) + 1,
  });
  
  const [activeMenuId, setActiveMenuId] = useState(null);

  // 2. Keep the order updated when the global collection array changes lengths
  useEffect(() => {
    setCollectionData((prev) => ({
      ...prev,
      order: (collection?.length || 0) + 1,
    }));
  }, [collection]);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!collectionData.name.trim()) return;

    try {
      await dispatch(createCollection(collectionData));
      
      // 3. Reset your form fields cleanly to baseline values
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
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
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
            placeholder="Search collection..."
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
              <th className="p-4">Collection Name</th>
              <th className="p-4 w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!collection || collection.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400 font-medium">
                  No collections found. Click "Collection" above to create one!
                </td>
              </tr>
            ) : (
              collection.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="border-t border-t-gray-300 relative"
                >
                  <td className="p-4 text-gray-600">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="p-4 text-center relative overflow-visible">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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

      {/* CREATE MODAL */}
      {isModelOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative mx-4">
            <button
              onClick={() => dispatch(setIsModelOpen(false))}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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
                className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 shadow-md"
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