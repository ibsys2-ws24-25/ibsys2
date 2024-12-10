import SplittingView from '@/components/pages/splitting/splittingView';

export default async function HomePage({ params }: { params: { periodId: number }}) {
    return (
        <SplittingView periodId={params.periodId}/>
    );
}