import { getPageMetadata } from "@/utils/pageMeta";
import { PAGE_CONSTANT } from "@/utils/constant";

export const metadata = getPageMetadata(PAGE_CONSTANT.PRIVACY_POLICY);

export default function PrivacyPolicyLayout({ children }) {
  return children;
}
