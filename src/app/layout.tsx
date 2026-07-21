import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Robil Dev | Full Stack Developer Portfolio", // Masukkan nama target di default
    template: "%s | Robil Dev", // Template untuk halaman lain
  },
  description: "Welcome to the professional portfolio of Robil, a Full Stack Developer specializing in React, Next.js, and web development. Discover my projects and skills.", // Masukkan nama dan profesi
  keywords: [
    "Robil", 
    "Robil Dev", 
    "Robil Full Stack Developer", 
    "portfolio", 
    "developer", 
    "web development", 
    "react", 
    "next.js"
  ], // Tambahkan variasi keyword nama Anda
  authors: [{ name: "Robil" }],
  creator: "Robil",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://robil.chatbotdev.online",
    title: "Robil Dev | Full Stack Developer",
    description: "Explore the professional portfolio, projects, and skills of Robil, a Full-Stack Developer.",
    siteName: "Robil Dev Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robil Dev | Full Stack Developer",
    description: "Explore the professional portfolio, projects, and skills of Robil, a Full-Stack Developer.",
  },
  robots: {
    index: true, // Sudah benar agar Google mengindeks situs Anda
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
         <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}