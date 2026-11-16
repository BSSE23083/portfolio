import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nav } from "@/components/site/Nav";
import { ThemeSync } from "@/components/site/ThemeSync";
import "./globals.css";

// Headings use Code 7x5. Body text uses Consolas from the visitor's computer (see globals.css).
const code7x5 = localFont({ src: "../fonts/Code7x5.ttf", variable: "--font-code7x5", display: "swap" });

export const metadata: Metadata = {
  title: "Abdul Samad Sohail | Portfolio",
  description: "I design and build interactive experiences, from apps to games.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={code7x5.variable} suppressHydrationWarning>
      <body>
        <ThemeSync />
        <Nav />
        {children}
      </body>
    </html>
  );
}
