import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FlowDense - Create Stunning Animated Backgrounds",
  description: "Create beautiful animated gradient backgrounds for your videos. Export in multiple formats and sizes for social media, presentations, and more.",
  keywords: ["gradient", "video", "background", "animation", "export", "social media"],
  authors: [{ name: "Video Gradient" }],
  openGraph: {
    title: "Video Gradient - Create Stunning Animated Backgrounds",
    description: "Create beautiful animated gradient backgrounds for your videos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
