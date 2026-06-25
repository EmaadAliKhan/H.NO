import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C-Type House Number Converter",
  description:
    "Convert between municipal and APHB C-Type house numbers for Sanjeeva Reddy Nagar Colony.",
  applicationName: "C-Type Converter",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "C-Type Converter",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f6cbd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
