import { Toaster } from "@repo/ui/components";
import { Analytics } from "@vercel/analytics/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/header";
import { Providers } from "@/components/providers";

import { AI } from "@/actions";

const projectName = "Open Search";

const meta = {
  title: `${projectName} - Powering insights with AI`,
  description:
    "Discover insights faster with Open Search. Combining the power of Google Search, OpenAI, and Cloudflare Workers AI to deliver and interact with AI-driven results.",
};

export const metadata: Metadata = {
  ...meta,
  title: {
    default: meta.title,
    template: `%s | ${projectName}`,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    ...meta,
    card: "summary_large_image",
    site: "@vercel", // todo: Update
  },
  openGraph: {
    ...meta,
    locale: "en-US",
    type: "website",
    url: "https://www.example.com", // todo: Update domain
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Open Search - AI-driven insights",
      },
    ],
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Toaster />
        <AI>
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex flex-col flex-1 bg-muted/50 dark:bg-background px-4">
                {children}
              </main>
            </div>
          </Providers>
        </AI>
        <Analytics />
      </body>
    </html>
  );
}
