import CreatePeriod from "@/components/pages/periods/CreatePeriod";
import PeriodCardGrid from "@/components/pages/periods/PeriodCardGrid";
import { Metadata } from "next";

async function fetchAllPeriods () {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period`, {
        cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch periods');
    }
    return response.json();
}

export const metadata: Metadata = {
    title: 'List of Periods',
};

export default async function HomePage() {
    const periods = await fetchAllPeriods();

    return (
        <div className="w-full mt-10">
            <CreatePeriod />
            <PeriodCardGrid periods={periods} />
        </div>
    );
}