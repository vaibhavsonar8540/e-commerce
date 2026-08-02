import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.MY_PRODUCTS);

export default function MyProductsLayout({ children }) {
  return children;
}
