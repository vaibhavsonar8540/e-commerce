import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.ADD_PRODUCT);

export default function AddProductLayout({ children }) {
  return children;
}
