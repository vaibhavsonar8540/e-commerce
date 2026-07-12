import dynamic from "next/dynamic";

 export const Authentication = dynamic(() => import("@/components/authentication/authentication"), {
  ssr: false,
});