import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "@/app/globals.css";
import { AppProviders } from "@/providers/app-providers";
import { Toaster } from "sonner";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "مشروع العيد | Eid Project",
  description: "منصة متطورة بتصميم عصري وأداء فائق",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-cairo antialiased`}>
        <AppProviders>
          {children}
          <Toaster 
            theme="system" 
            position="top-center" 
            richColors 
            closeButton
            toastOptions={{
              className: 'rounded-2xl border-white/60 dark:border-slate-800/60 backdrop-blur-xl shadow-2xl',
              style: {
                fontFamily: 'var(--font-cairo)',
              }
            }}
          />
        </AppProviders>
      </body>
    </html>
  );
}
