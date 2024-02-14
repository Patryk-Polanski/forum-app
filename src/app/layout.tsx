import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

import NavBar from "@/components/NavBar";

import "@/styles/globals.css";

export const metadata = {
  title: "Breadit",
  description: "A forum app built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <NavBar />
        <div className="container max-w-7xl mx-auto h-full pt-12">
          {children}
        </div>
      </body>
    </html>
  );
}
