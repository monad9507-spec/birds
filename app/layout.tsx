import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INKBIRDS — Mint on Ink",
  description: "Meet the Inkbirds. Mint your pixel bird on Ink. Public mint: 0.00005 ETH, up to 250 per wallet.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
