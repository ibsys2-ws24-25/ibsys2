import CreatePeriod from "@/components/pages/periods/CreatePeriod";
import LinkTable from "@/components/pages/periods/linkTable"

export default async function PeriodViewPage({ params }: { params: { periodId: number } }) {
    console.log(params);
    
    return (
        <div>
            <CreatePeriod />
            <LinkTable/>
        </div>
    );
}