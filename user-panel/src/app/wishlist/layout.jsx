import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.WISHLIST);

export default function WishlistLayout({ children }) {
  return children;
}
