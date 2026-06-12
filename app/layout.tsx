import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QalaVision AI",
  description:
    "AI platform for urban issue detection and repair prioritization in Almaty."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-pearl font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
