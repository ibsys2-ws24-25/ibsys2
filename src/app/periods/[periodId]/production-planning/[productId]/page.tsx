import MaterialTable from '@/components/pages/material/materialTable';

export default async function HomePage({ params }: { params: { periodId: number, productId: number } }) {
    console.log(params);

    return (
        <div>
            <h1 className='text-2xl font-bold mb-4 text-primary'>Production Plan for Product {params.productId} in Period {params.periodId}</h1>
            <MaterialTable />
        </div>
    );
}
