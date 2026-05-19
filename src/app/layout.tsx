import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/components/providers/app-provider";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f7f7f8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full theme-monochrome">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-[100dvh] antialiased">
        <AppProvider>
          {children}
          <InstallPrompt />
        </AppProvider>
      </body>
    </html>
  );
}
