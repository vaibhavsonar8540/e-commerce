import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";
import { getMediaUrl } from "@/utils/imageUrl";

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const productId = unwrappedParams?.id;

  if (productId) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${baseUrl}/product/get/${productId}`, {
        next: { revalidate: 60 },
      })
        .then((r) => r.json())
        .catch(() => null);

      if (res?.success && res?.product) {
        const prod = res.product;
        const imgUrl = getMediaUrl(prod.thumbnail || prod.images?.[0]);
        return getPageMetadata(PAGE_CONSTANT.PRODUCT_DETAIL, {
          title: prod.productName,
          description:
            prod.description ||
            `Shop ${prod.productName} at Veloza Store. Premium quality fashion & fast shipping.`,
          image: imgUrl,
        });
      }
    } catch (err) {
      // Catch silently and fallback to default product metadata
    }
  }

  return getPageMetadata(PAGE_CONSTANT.PRODUCT_DETAIL);
}

export default function ProductDetailLayout({ children }) {
  return children;
}
