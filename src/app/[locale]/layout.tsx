import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SidebarComponent from "@/components/layout/SidebarComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import initTranslation from '@/i18n';
import { Calendar, Home, Search, Settings } from "lucide-react"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { t } = await initTranslation(params.locale, ['sidebar']);

  const sidebarLinks = [
    {
      title: t("home"),
      url: "/",
      icon: Home,
    },
    {
      title: t("bom"),
      url: "/bill-of-materials",
      icon: Search,
    },
    {
      title: t("periods"),
      url: "/periods",
      icon: Calendar,
    },
    {
      title: t("settings"),
      url: "/settings",
      icon: Settings,
    },
]

  return (
    <html lang={params.locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <SidebarProvider>
          <SidebarComponent links={ sidebarLinks } applicationTabTitle={ t("application_tab_title") } locale={ params.locale } />
          <div className="flex justify-between w-full m-5">
            <SidebarTrigger />
            <div className="w-full flex justify-center">
                {children}
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
