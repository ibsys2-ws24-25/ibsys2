// app/page.tsx

import LineChartStatistic from "@/components/statistic/LineChartStatistic";

export default function HomePage() {
    return (
        <div className="mt-10 w-full">
            <h1 className="text-4xl font-bold text-center mb-8">Bicycle Calculation Tool</h1>
            <div className="flex flex-col gap-4">
              <LineChartStatistic
                cardTitle="Profit Summary"
                cardDescription=""
                types={
                  [
                    'summary_profit',
                    'normalsale_profit',
                    'directsale_profit',
                    'marketplacesale_profit'
                  ]
                }
                disableAverage={ true }
              />
              <LineChartStatistic
                cardTitle="Capacity"
                cardDescription=""
                types={
                  [
                    'summary_profit',
                    'directsale_profit',
                    'marketplacesale_profit'
                  ]
                }
                disableAverage={ true }
              />
            </div>
        </div>
    );
}
