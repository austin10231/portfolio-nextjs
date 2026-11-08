import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { PreferencesProvider } from "@/components/preferences";
import { Effects } from "@/components/effects";
import "./globals.css";

const poppins = Poppins({ weight: ["400", "500", "700"], subsets: ["latin"], display: "swap", variable: "--font-poppins" });
export const metadata: Metadata = {
  title: { default: "Mutian He | MSIS Student at SCU", template: "%s | Mutian He" },
  description: "Portfolio of Mutian He — MSIS student at Santa Clara University, skilled in machine learning, deep learning, and system design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><head>
    <link rel="stylesheet" href="/vendor/fontawesome/css/all.min.css" />
  </head><body className={`light ${poppins.variable}`} id="top" suppressHydrationWarning>
    <PreferencesProvider>{children}<Effects /></PreferencesProvider>
  </body></html>;
}
