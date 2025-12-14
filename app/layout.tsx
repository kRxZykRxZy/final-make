import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "./lib/footer/footer";
import MenuBar from "./lib/menu-bar/menu-bar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeBuild",
  description: "The Newest Code Build Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MenuBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
