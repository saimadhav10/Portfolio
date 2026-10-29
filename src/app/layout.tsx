import type { Metadata } from "next";
import "./globals.scss";
export const metadata: Metadata = {
  metadataBase: new URL("https://saimadhav1.runs-on.dev"),
  title: "Sai Madhav — Data, numbers & things I build",
  description:
    "Computer Science student specializing in Data Science at Mar Athanasius College of Engineering. Explore projects, skills, and ideas by Sai Madhav.",
  openGraph: {
    title: "Sai Madhav — Portfolio",
    description: "Fascinated by data. Driven to build.",
    type: "website",
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
