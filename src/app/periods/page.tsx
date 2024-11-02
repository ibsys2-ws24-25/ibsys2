import CreatePeriod from "@/components/pages/periods/CreatePeriod";
import LinkTable from "@/components/pages/periods/linkTable"

export default async function HomePage() {
    return (
        <div>
            <CreatePeriod />
            <LinkTable/>
        </div>
    );
}