import ReorderView from '@/components/pages/reorderProduction/reorderView';

export default async function HomePage({ params }: { params: { periodId: number }}) {
    return (
        <ReorderView periodId={params.periodId}/>
    );
}