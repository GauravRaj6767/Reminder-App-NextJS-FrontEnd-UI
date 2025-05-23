import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/authProvider";

import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/themeProvider";
import BaseLayout from "@/components/layout/BaseLayout";
import { Suspense } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Reminder App",
  description: "Reminder App using NextJS and Django Ninja API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
          >
            <AuthProvider>
              <BaseLayout className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col bg-muted/40">
                {children}
              </BaseLayout>
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}