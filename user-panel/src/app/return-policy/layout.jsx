import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.RETURN_POLICY);

export default function ReturnPolicyLayout({ children }) {
  return children;
}
