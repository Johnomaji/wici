import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WICI Pilot Console",
  description: "Waste Intelligence & Circular Infrastructure: pilot demo for the STS@10 pitch",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
