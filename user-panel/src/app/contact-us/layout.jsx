import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.CONTACT_US);

export default function ContactUsLayout({ children }) {
  return children;
}
