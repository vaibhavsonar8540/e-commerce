export const IMG_ALT_TITLE = {
  DEFAULT: {
    title: "Veloza Store Premium Fashion Outfit",
    alt: "Veloza Fashion Product Apparel Photo",
  },
  LOGO: {
    title: "Veloza Store Official Brand Logo",
    alt: "Veloza Store Logo",
  },
  BANNER: {
    title: "Veloza Trending Fashion Banner",
    alt: "Veloza Hero Banner & Seasonal Special Offers",
  },
  CATEGORIES: {
    title: "Veloza Apparel Categories",
    alt: "Browse Clothing Category Collection",
  },
  PRODUCT_CARD: {
    title: "Veloza Apparel Product",
    alt: "High-quality Fashion Product Thumbnail",
  },
  CART_ITEM: {
    title: "Cart Product Thumbnail",
    alt: "Selected Cart Apparel Item",
  },
  PLACEHOLDER: {
    title: "Veloza Placeholder Image",
    alt: "Product Image Loading Placeholder",
  },
};

/**
 * Utility function to generate dynamic image alt and title attributes
 * @param {string} productName - Name of the product or image subject
 * @param {string} fallbackKey - Key from IMG_ALT_TITLE
 * @returns {{ title: string, alt: string }}
 */
export function getImgAltTitle(productName, fallbackKey = "DEFAULT") {
  if (productName && typeof productName === "string" && productName.trim().length > 0) {
    const cleanName = productName.trim();
    return {
      title: `${cleanName} - Veloza Premium Collection`,
      alt: `${cleanName} high resolution apparel photo`,
    };
  }

  const fallback = IMG_ALT_TITLE[fallbackKey] || IMG_ALT_TITLE.DEFAULT;
  return {
    title: fallback.title,
    alt: fallback.alt,
  };
}