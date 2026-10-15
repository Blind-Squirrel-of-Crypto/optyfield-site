import { DM_Sans, Space_Mono } from "next/font/google";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-dm-sans", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono", display: "swap" });

const description =
  "Service software for commercial fitness equipment companies. Customers approve repairs machine by machine in a portal, every machine has a history by make, model and serial, and dispatchers plan the day on one board and map.";

export const metadata = {
  metadataBase: new URL("https://www.optyfield.com"),
  title: {
    default: "OptyField — Service software for commercial fitness equipment companies",
    template: "%s | OptyField",
  },
  description,
  keywords: [
    "fitness equipment service software",
    "commercial fitness equipment repair software",
    "gym equipment maintenance software",
    "treadmill repair estimates",
    "fitness equipment service company CRM",
    "field service software fitness",
  ],
  openGraph: {
    title: "OptyField — Service software for commercial fitness equipment companies",
    description,
    url: "https://www.optyfield.com",
    siteName: "OptyField",
    type: "website",
    images: [{ url: "/demo/shots/dispatch-board.png", width: 1920, height: 1200, alt: "OptyField dispatch board" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
