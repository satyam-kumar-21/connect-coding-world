import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coding World Connect - Developer Community & Collaboration Platform",
  description: "Connect with developers, solve coding problems, earn XP, and collaborate in real-time. Learn. Code. Connect. Collaborate.",
  keywords: ["developers", "coding", "programming", "collaboration", "community", "learning"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
