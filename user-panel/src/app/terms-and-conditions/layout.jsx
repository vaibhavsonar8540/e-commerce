import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.TERMS_AND_CONDITIONS);

export default function TermsAndConditionsLayout({ children }) {
  return children;
}
