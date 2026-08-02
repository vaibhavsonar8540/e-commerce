import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.SELLER);

export default function SellerLayout({ children }) {
  return children;
}
