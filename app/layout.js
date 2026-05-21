import { Montserrat } from "next/font/google";
import "./globals.css";

// Per the LOL brand guide, Montserrat is the single typeface across the
// UI (display + body). We load the full weight range we use in CSS.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Teacher Meme Library | Legends of Learning",
  description:
    "Hand-picked, school-safe teacher memes. Share as-is or customize captions in two clicks. By Legends of Learning.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001")
  ),
  openGraph: {
    title: "Teacher Meme Generator",
    description:
      "20 real meme formats, captions written for teachers. By Legends of Learning.",
    type: "website",
    siteName: "Legends of Learning",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teacher Meme Generator",
    description: "20 real meme formats, captions written for teachers.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
