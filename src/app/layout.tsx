import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SidebarComponent from "@/components/layout/SidebarComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <SidebarComponent />
          <div className="flex justify-center min-h-screen w-full m-5">
            <SidebarTrigger />
            <div className="max-w-7xl w-full flex justify-center m-5 mt-10">
                {children}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
