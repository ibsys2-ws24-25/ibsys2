// app/page.tsx

import LineChartStatistic from "@/components/statistic/LineChartStatistic";

export default function HomePage() {
    return (
        <div className="mt-10 w-full">
            <h1 className="text-4xl font-bold text-center mb-8">Bicycle Calculation Tool</h1>
            <div className="flex flex-col gap-4">
              <LineChartStatistic
                cardTitle="Combined Profits"
                cardDescription="Here you can find the combined profits from all sale points"
                types={
                  [
                    'summary_profit',
                  ]
                }
                disableAverage={ false }
              />
              <LineChartStatistic
                cardTitle="Profit streams"
                cardDescription="Here you can find details of each profit stream"
                types={
                  [
                    'normalsale_profit',
                    'directsale_profit',
                    'marketplacesale_profit'
                  ]
                }
                disableAverage={ true }
              />
              <LineChartStatistic
                cardTitle="Store Value"
                cardDescription="Here you can see the value of our storage"
                types={
                  [
                    'storevalue',
                  ]
                }
                disableAverage={ false }
              />
              <LineChartStatistic
                cardTitle="Storage Costs"
                cardDescription="Here you can see our storage costs over the periods"
                types={
                  [
                    'storagecosts',
                  ]
                }
                disableAverage={ false }
              />
              <LineChartStatistic
                cardTitle="Delivery Reliability"
                cardDescription="Here you can see Delivery Reliability per period"
                types={
                  [
                    'deliveryreliability',
                  ]
                }
                disableAverage={ false }
              />
              <LineChartStatistic
                cardTitle="Sales"
                cardDescription="Here you can see the sales per period"
                types={
                  [
                    'salesquantity',
                  ]
                }
                disableAverage={ false }
              />
              <LineChartStatistic
                cardTitle="Capacity"
                cardDescription="Here you can see the possible capacity and the used capacity"
                types={
                  [
                    'possiblecapacity',
                    'productivetime'
                  ]
                }
                disableAverage={ true }
              />
              <LineChartStatistic
                cardTitle="Efficiency"
                cardDescription="Here you can see the efficiency in %"
                types={
                  [
                    'effiency',
                  ]
                }
                disableAverage={ true }
              />
            </div>
        </div>
    );
}
