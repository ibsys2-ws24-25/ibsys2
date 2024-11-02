export default async function PeriodViewPage({ params }: { params: { periodId: number } }) {    
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-primary">Overview of Period {params.periodId}</h1>
        </div>
    );
}