import { DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata = {
  title: "OptyField — Field Service CRM",
  description:
    "The field service CRM built for teams that move. AI-powered estimates, real-time dispatch, a technician mobile app, and a customer portal — all connected.",
  keywords: [
    "field service CRM",
    "dispatch software",
    "AI estimating",
    "work order management",
    "technician mobile app",
    "QuickBooks integration",
    "route optimization",
    "customer portal",
    "field service management",
  ],
  openGraph: {
    title: "OptyField — Field Service CRM",
    description:
      "Dispatch smarter. Serve faster. AI-powered estimates, real-time dispatch, and a customer portal — all connected.",
    url: "https://optyfield.com",
    siteName: "OptyField",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OptyField — Field Service CRM",
    description:
      "Dispatch smarter. Serve faster. AI-powered estimates, real-time dispatch, and a customer portal — all connected.",
  },
  metadataBase: new URL("https://optyfield.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
