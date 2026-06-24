import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Some Meat",
  description: "Interactive archive of Some Meat party",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
