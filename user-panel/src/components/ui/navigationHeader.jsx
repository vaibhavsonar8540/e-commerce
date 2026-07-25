"use client";

import { fetchCategories, fetchCollection, fetchSUbCategories } from "@/redux/action/commonAction";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

const NavigationHeader = () => {
  const dispatch = useDispatch();
  const [hoverCollection, setHoverCollection] = useState(null);
  const closeTimer = useRef(null);

const openMenu = (item) => {
  if (closeTimer.current) {
    clearTimeout(closeTimer.current);
  }
  setHoverCollection(item);
};

const closeMenu = () => {
  closeTimer.current = setTimeout(() => {
    setHoverCollection(null);
  }, 250); // 250ms feels natural
};

  const { collection, categories, subCategories, headerHeight, loading } = useSelector((state) => state.common);

  useEffect(() => {
    dispatch(fetchCollection());
    dispatch(fetchCategories());
    dispatch(fetchSUbCategories());
  }, [dispatch]);

  if (loading && (!collection || collection.length === 0)) {
    return (
      <div className="flex gap-8 items-center">
        <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  const filteredCategories = hoverCollection
    ? categories.filter((item) => item.collectionName?._id === hoverCollection._id)
    : [];

  return (
    <div onMouseLeave={closeMenu}>
      <div className="flex gap-10">
        {collection.map((item) => (
          <div
            key={item._id}
            className="group py-2"
            onMouseEnter={() => openMenu(item)}
          >
            <Link href={`/collection/${item.slug}`} className="text-primary font-medium uppercase tracking-wider text-sm">
              {item.name}
            </Link>
            <div className="mt-1 h-0.5 w-0 bg-primary transition-all duration-300 ease-in-out group-hover:w-full"></div>
          </div>
        ))}
      </div>

      {hoverCollection && (
        <div
          onMouseEnter={() => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
          }}
          onMouseLeave={closeMenu}
          className="absolute left-0 bg-white shadow-xl z-50 w-full min-h-[40vh] max-h-[65vh] overflow-y-auto border-t border-t-primary"
          style={{ top: headerHeight }}
        >
          <div className="flex px-10 py-8 gap-10 maxWidthContainer mx-auto">
            <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {filteredCategories.map((cat) => {
                const filteredSubs = subCategories.filter((sub) => sub.category?._id === cat._id);

                return (
                  <div key={cat._id} className="flex flex-col">
                    {/* Dynamic Category Link */}
                    <Link
                      href={`/collection/${hoverCollection.slug}/${cat.slug}`}
                      className="font-semibold text-gray-900 text-base mb-3 font-playfair! hover:text-primary transition-colors"
                    >
                      {cat.name}
                    </Link>

                    {/* Dynamic Sub-Categories Links */}
                    <div className="flex flex-col gap-2.5">
                      {filteredSubs.map((sub) => (
                        <Link
                          href={`/collection/${hoverCollection.slug}/${cat.slug}/${sub.slug}`}
                          key={sub._id}
                          className="text-gray-600 hover:text-primary text-sm transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationHeader;