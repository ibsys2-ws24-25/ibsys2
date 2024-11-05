import ProductionPlanNavigation from "@/components/layout/ProductionPlanNavigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Production Planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full">
        <div className="flex justify-center align-center">
            <ProductionPlanNavigation />
        </div>
        <div className="m-5">
            {children}
        </div>
    </div>
  );
}
