import "./globals.css";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SmoothScroll from "@/components/smoothScroll";
import Providers from "./Provider";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const raleway = localFont({
  src: [
    {
      path: "../../public/fonts/Railway/Raleway-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Railway/Raleway-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Railway/Raleway-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Railway/Raleway-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Railway/Raleway-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-raleway",
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

export const metadata = {
  title: "Veloza - E-Commerce Store",
  description: "Your ultimate shopping destination",
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


import SplashScreen from "@/components/splashScreen";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SmoothScroll>
          <Providers>
            <SplashScreen />
            <Header />
            <main className="grow flex flex-col w-full">
              {children}
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          </Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
