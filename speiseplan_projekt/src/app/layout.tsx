// Import required modules and styles
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Define Inter font
const inter = Inter({ subsets: ["latin"] });

// Metadata for the website
export const metadata: Metadata = {
  title: "Kantinerado",
  description: "Speiseplan-Projekt",
};

// RootLayout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        {/* Wrap the children inside a container div */}
        <div className="min-h-full max-w-[1640px] mx-auto lg:px-48 px-4 flex flex-col">
          {/* Render the children */}
          {children}
        </div>
      </body>
    </html>
  );
}
