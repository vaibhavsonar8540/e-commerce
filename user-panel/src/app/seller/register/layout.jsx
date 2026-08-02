import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.SELLER_REGISTER);

export default function SellerRegisterLayout({ children }) {
  return children;
}
