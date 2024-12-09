import WorktimeView from '@/components/pages/worktime/worktimeView';

export default async function HomePage({ params }: { params: { periodId: number }}) {
    return (
        <WorktimeView periodId={params.periodId}/>
    );
}