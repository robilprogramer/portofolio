import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio | Full Stack Developer",
    template: "%s | Portfolio",
  },
  description: "A professional portfolio showcasing projects, skills, and experience in full-stack development.",
  keywords: ["portfolio", "developer", "full-stack", "web development", "react", "next.js"],
  authors: [{ name: "Robil" }],
  creator: "Robil",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourportfolio.com",
    title: "Portfolio | Full Stack Developer",
    description: "A professional portfolio showcasing projects, skills, and experience.",
    siteName: "Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Full Stack Developer",
    description: "A professional portfolio showcasing projects, skills, and experience.",
  },
  robots: {
    index: true,
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
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
