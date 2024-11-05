import CreatePeriod from "@/components/pages/periods/CreatePeriod";
import LinkTable from "@/components/pages/periods/linkTable"

async function fetchAllPeriods () {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period`, {
        cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch periods');
    }
    return response.json();
}


export default async function HomePage() {
    const periods = await fetchAllPeriods();

    return (
        <div className="w-full">
            <CreatePeriod />
            <LinkTable periods={periods} />
        </div>
    );
}