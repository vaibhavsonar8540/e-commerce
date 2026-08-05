"use client";

import dynamic from "next/dynamic";

// ==========================================
// AUTHENTICATION & CORE MODALS
// ==========================================
export const Authentication = dynamic(
  () => import("@/components/authentication/authentication"),
  { ssr: false }
);

export const CartDrawer = dynamic(
  () => import("@/components/ui/cartDrawer"),
  { ssr: false }
);

// ==========================================
// LAYOUT & NAVIGATION COMPONENTS ("use client")
// ==========================================
export const DynamicHeader = dynamic(
  () => import("@/components/ui/header"),
  { ssr: false }
);

export const DynamicFooter = dynamic(
  () => import("@/components/ui/footer"),
  { ssr: false }
);

export const DynamicNavigationHeader = dynamic(
  () => import("@/components/ui/navigationHeader"),
  { ssr: false }
);

export const DynamicSmoothScroll = dynamic(
  () => import("@/components/smoothScroll"),
  { ssr: false }
);

export const DynamicSplashScreen = dynamic(
  () => import("@/components/splashScreen"),
  { ssr: false }
);

// ==========================================
// HOME & PRODUCT UI COMPONENTS ("use client")
// ==========================================
export const DynamicHomePage = dynamic(
  () => import("@/components/home/HomePage"),
  { ssr: false }
);

export const DynamicHeroCarousel = dynamic(
  () => import("@/components/heroCarousel"),
  { ssr: false }
);

export const DynamicProductDetail = dynamic(
  () => import("@/components/productDetail"),
  { ssr: false }
);

export const DynamicProductSlider = dynamic(
  () => import("@/components/productSlider"),
  { ssr: false }
);

export const DynamicOtherCollection = dynamic(
  () => import("@/components/otherCollection"),
  { ssr: false }
);

export const DynamicMarqueeComponent = dynamic(
  () => import("@/components/marqueeComponent"),
  { ssr: false }
);

// ==========================================
// ALL "use client" APP PAGES
// ==========================================
export const AddProductPage = dynamic(
  () => import("@/app/add-product/page"),
  { ssr: false }
);

export const CartPage = dynamic(
  () => import("@/app/cart/page"),
  { ssr: false }
);

export const CheckoutPage = dynamic(
  () => import("@/app/checkout/page"),
  { ssr: false }
);

export const CheckoutSuccessPage = dynamic(
  () => import("@/app/checkout-success/page"),
  { ssr: false }
);

export const CollectionPage = dynamic(
  () => import("@/app/collection/[[...slug]]/page"),
  { ssr: false }
);

export const ContactUsPage = dynamic(
  () => import("@/app/contact-us/page"),
  { ssr: false }
);

export const MyProductsPage = dynamic(
  () => import("@/app/my-products/page"),
  { ssr: false }
);

export const OrderPage = dynamic(
  () => import("@/app/order/page"),
  { ssr: false }
);

export const PaymentPage = dynamic(
  () => import("@/app/payment/page"),
  { ssr: false }
);

export const PrivacyPolicyPage = dynamic(
  () => import("@/app/privacy-policy/page"),
  { ssr: false }
);

export const ProductDetailPage = dynamic(
  () => import("@/app/product/[id]/page"),
  { ssr: false }
);

export const ProfilePage = dynamic(
  () => import("@/app/profile/page"),
  { ssr: false }
);

export const ReturnPolicyPage = dynamic(
  () => import("@/app/return-policy/page"),
  { ssr: false }
);

export const SellerPage = dynamic(
  () => import("@/app/seller/page"),
  { ssr: false }
);

export const SellerRegisterPage = dynamic(
  () => import("@/app/seller/register/page"),
  { ssr: false }
);

export const SitemapPage = dynamic(
  () => import("@/app/sitemap/page"),
  { ssr: false }
);

export const TermsAndConditionsPage = dynamic(
  () => import("@/app/terms-and-conditions/page"),
  { ssr: false }
);

export const WishlistPage = dynamic(
  () => import("@/app/wishlist/page"),
  { ssr: false }
);0