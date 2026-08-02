import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.CHECKOUT_SUCCESS);

export default function CheckoutSuccessLayout({ children }) {
  return children;
}
