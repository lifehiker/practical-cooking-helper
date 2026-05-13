import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "FridgeMeal – Use What You Have, Skip the Recipe Blog",
    template: "%s | FridgeMeal",
  },
  description:
    "Turn leftover ingredients into practical meal ideas, or paste any recipe URL for a clean, distraction-free view with just ingredients, steps, cook time, and servings.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "FridgeMeal",
    title: "FridgeMeal – Use What You Have, Skip the Recipe Blog",
    description:
      "Turn leftover ingredients into practical meal ideas, or paste any recipe URL for a clean view with just the recipe.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
