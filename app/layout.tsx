import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YH Store",
  description: "Your favorite online store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white font-sans text-neutral-950 antialiased">
        {children}
      </body>
    </html>
  );
}
