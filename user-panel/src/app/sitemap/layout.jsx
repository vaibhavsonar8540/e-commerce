import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.SITEMAP);

export default function SitemapLayout({ children }) {
  return children;
}
