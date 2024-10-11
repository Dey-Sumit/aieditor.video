import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "../styles/global.css";
import "../styles/prosemirror.css";
export const metadata: Metadata = {
  title: "aieditor.video",
  description:
    "AI powered video editor for everyone | Easy to use video editor",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
