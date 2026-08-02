import { PAGE_CONSTANT } from "./constant";

export const SITE_NAME = "Veloza Store";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://veloza.com";

export const DEFAULT_META = {
  title: "Veloza Store | Premium Fashion, Apparel & Modern Clothing Catalog",
  description:
    "Discover trending luxury fashion, minimalist clothing, elegant footwear, and modern lifestyle accessories at Veloza Store. Fast shipping, easy returns & 100% secure checkout.",
  keywords:
    "veloza, fashion store, online clothing, luxury apparel, streetwear, modern fashion, buy clothes online, trendy outfits, premium lifestyle",
  url: SITE_URL,
  openGraph: {
    title: "Veloza Store | Premium Fashion & Modern Lifestyle Catalog",
    description:
      "Explore curated luxury apparel, stylish collections, and premium fashion accessories at Veloza Store.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
};

export const PAGE_META = {
  [PAGE_CONSTANT.HOME]: {
    title: "Veloza Store | Premium Fashion, Clothing & Apparel Online",
    description:
      "Shop the latest collection of premium clothing, fashion apparel, and modern accessories at Veloza Store. Express your unique style with high-quality designs.",
    keywords: "veloza home, fashion online, premium clothing, buy dresses, stylish apparel, online fashion boutique",
  },
  [PAGE_CONSTANT.COLLECTION]: {
    title: "Explore Fashion Collections | Trendy Apparel & Styles - Veloza",
    description:
      "Browse our exclusive fashion collections. Discover high-end shirts, jackets, pants, dresses, and seasonal outfits tailored for style enthusiasts.",
    keywords: "fashion collection, clothing categories, designer outfits, online catalog, veloza collection",
  },
  [PAGE_CONSTANT.PRODUCT_DETAIL]: {
    title: "Product Details | Veloza Store",
    description:
      "Explore detailed specifications, fabric quality, sizing guides, and authentic customer reviews for top fashion picks at Veloza Store.",
    keywords: "product details, buy product, fashion items, clothes specifications",
  },
  [PAGE_CONSTANT.CART]: {
    title: "Your Shopping Bag | Review Order Items - Veloza",
    description:
      "Review your selected fashion items, apply discount coupons, and prepare for seamless checkout at Veloza Store.",
    keywords: "shopping cart, cart review, fashion bag, online order summary",
  },
  [PAGE_CONSTANT.CHECKOUT]: {
    title: "Secure Checkout & Shipping Details | Veloza",
    description:
      "Provide your delivery shipping address and customer information for fast & secure delivery from Veloza Store.",
    keywords: "checkout, shipping details, order address, secure checkout",
  },
  [PAGE_CONSTANT.CHECKOUT_SUCCESS]: {
    title: "Order Placed Successfully | Thank You - Veloza",
    description:
      "Thank you for shopping with Veloza! Your order has been placed successfully. Track your shipping and order details here.",
    keywords: "order success, order confirmation, thank you page, veloza receipt",
  },
  [PAGE_CONSTANT.ORDER]: {
    title: "Checkout & Shipping Address | Veloza Store",
    description:
      "Review your delivery details, contact preferences, and shipping destination before placing your order.",
    keywords: "order details, checkout address, customer delivery",
  },
  [PAGE_CONSTANT.PAYMENT]: {
    title: "Select Payment Method | Safe & Instant Checkout - Veloza",
    description:
      "Choose from safe Razorpay online payment options, credit/debit cards, UPI, or Pay on Delivery to complete your purchase.",
    keywords: "payment method, online payment, razorpay, secure payment, cash on delivery",
  },
  [PAGE_CONSTANT.WISHLIST]: {
    title: "My Favorites & Saved Wishlist | Veloza Store",
    description:
      "View your saved favorite fashion items, wishlisted outfits, and store them for future purchases at Veloza Store.",
    keywords: "wishlist, saved products, favorite items, fashion wishlist",
  },
  [PAGE_CONSTANT.PROFILE]: {
    title: "My Account & Profile Dashboard | Veloza",
    description:
      "Manage your personal account settings, profile information, password security, and seller store credentials at Veloza.",
    keywords: "user profile, my account, profile parameters, customer dashboard",
  },
  [PAGE_CONSTANT.MY_PRODUCTS]: {
    title: "My Store Products & Listed Catalog | Veloza Seller",
    description:
      "Manage your seller store inventory, view active product catalog listings, and update product details on Veloza Marketplace.",
    keywords: "seller products, inventory management, store catalog, product listing",
  },
  [PAGE_CONSTANT.ADD_PRODUCT]: {
    title: "Add New Product to Store Catalog | Veloza Seller",
    description:
      "Upload high-quality images, specify product pricing, inventory counts, and list new fashion products in your store.",
    keywords: "add product, create listing, sell clothes online, seller portal",
  },
  [PAGE_CONSTANT.SELLER]: {
    title: "Become a Seller & Expand Your Fashion Brand | Veloza",
    description:
      "Join Veloza Seller Marketplace. Partner with us to list your brand, reach thousands of fashion shoppers, and grow your sales.",
    keywords: "become a seller, merchant registration, sell on veloza, merchant partner",
  },
  [PAGE_CONSTANT.SELLER_REGISTER]: {
    title: "Seller Registration Portal | Create Merchant Account - Veloza",
    description:
      "Register your business details, address, and contact info to start selling your products on Veloza Marketplace today.",
    keywords: "seller registration, store onboarding, merchant sign up",
  },
  [PAGE_CONSTANT.CONTACT_US]: {
    title: "Contact Us & Customer Support | Veloza Store",
    description:
      "Have questions regarding your order, shipping, or returns? Get in touch with Veloza customer support team 24/7.",
    keywords: "contact veloza, customer care, support email, help center",
  },
  [PAGE_CONSTANT.PRIVACY_POLICY]: {
    title: "Privacy Policy & Data Security | Veloza",
    description:
      "Learn how Veloza protects your personal data, payment details, and privacy while shopping on our platform.",
    keywords: "privacy policy, data protection, user security, cookies policy",
  },
  [PAGE_CONSTANT.RETURN_POLICY]: {
    title: "Return, Replacement & Refund Policy | Veloza",
    description:
      "Read our hassle-free 7-day return and exchange policy. Easy refunds and simple product replacement processes at Veloza.",
    keywords: "return policy, refund policy, exchange clothes, customer guarantee",
  },
  [PAGE_CONSTANT.TERMS_AND_CONDITIONS]: {
    title: "Terms & Conditions | Veloza Store",
    description:
      "Review the legal terms of service, platform policies, user agreements, and shopping guidelines for Veloza Store.",
    keywords: "terms and conditions, terms of service, legal policy, shopping rules",
  },
  [PAGE_CONSTANT.SITEMAP]: {
    title: "Site Map & Quick Links Navigation | Veloza",
    description:
      "Browse our full directory of pages, collections, product categories, and store information links at Veloza.",
    keywords: "sitemap, page directory, website navigation, veloza links",
  },
};

/**
 * Helper to get metadata object for Next.js App Router
 * @param {string} pageKey - Key from PAGE_CONSTANT
 * @param {object} dynamicMeta - Dynamic metadata overrides (title, description, keywords, image, url)
 */
export function getPageMetadata(pageKey, dynamicMeta = {}) {
  const base = PAGE_META[pageKey] || DEFAULT_META;
  const title = dynamicMeta.title
    ? `${dynamicMeta.title} | Veloza Store`
    : base.title;
  const description = dynamicMeta.description || base.description;
  const keywords = dynamicMeta.keywords || base.keywords;
  const image = dynamicMeta.image || "/og-image.jpg";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: dynamicMeta.url || SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          alt: dynamicMeta.title || title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}