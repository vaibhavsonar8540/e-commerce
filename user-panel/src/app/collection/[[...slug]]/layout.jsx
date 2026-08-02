import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const slug = unwrappedParams?.slug || [];

  if (slug.length > 0) {
    const categoryName = slug.map((s) => s.replace(/-/g, " ")).join(" - ");
    const formattedName =
      categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    return getPageMetadata(PAGE_CONSTANT.COLLECTION, {
      title: `${formattedName} Collection`,
      description: `Shop the latest ${formattedName} fashion trends and luxury apparel at Veloza Store. Fast shipping & easy returns.`,
    });
  }

  return getPageMetadata(PAGE_CONSTANT.COLLECTION);
}

export default function CollectionLayout({ children }) {
  return children;
}
