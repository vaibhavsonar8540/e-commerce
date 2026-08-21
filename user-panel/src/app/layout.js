import "./globals.css";
import Script from "next/script";
import Providers from "./Provider";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DynamicHeader,
  DynamicFooter,
  DynamicSmoothScroll,
  DynamicSplashScreen,
} from "@/components/DynamicComponents";

const openSans = localFont({
  src: [
    {
      path: "../../public/fonts/OpenSans/OpenSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenSans/OpenSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenSans/OpenSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenSans/OpenSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenSans/OpenSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenSans/OpenSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-opensans",
});

const playfairDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/PlayFairDisplay/PlayfairDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/PlayFairDisplay/PlayfairDisplay-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/PlayFairDisplay/PlayfairDisplay-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/PlayFairDisplay/PlayfairDisplay-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-playfair",
});

import { DEFAULT_META } from "@/utils/pageMeta";

export const metadata = {
  title: DEFAULT_META.title,
  description: DEFAULT_META.description,
  keywords: DEFAULT_META.keywords,
  openGraph: DEFAULT_META.openGraph,
  verification: {
    google: "google5c7ad7afbf8414d5",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="Znh/owIvld+ylX3c3MHL4A"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <DynamicSmoothScroll>
          <Providers>
            <DynamicSplashScreen />
            <DynamicHeader />
            <main className="grow flex flex-col w-full">
              {children}
            </main>
            <DynamicFooter />
            <ToastContainer
              position="bottom-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick={true}
              pauseOnHover={true}
              theme="light"
            />
          </Providers>
        </DynamicSmoothScroll>
      </body>
    </html>
  );
}
