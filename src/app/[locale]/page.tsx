import initTranslation from '@/i18n';
import LineChartStatistic from "@/components/statistic/LineChartStatistic";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { t } = await initTranslation(params.locale, ['home']);
  return (
      <div className="mt-10 w-full">
          <h1 className="text-4xl font-bold text-center mb-8">Bicycle Calculation Tool</h1>
          <div className="flex flex-col gap-4">
            <LineChartStatistic
              cardTitle={t("combined_profits")}
              cardDescription={t("combined_profits_desc")}
              types={
                [
                  'summary_profit',
                ]
              }
              disableAverage={ false }
            />
            <LineChartStatistic
              cardTitle={t("profit_streams")}
              cardDescription={t("profit_streams_desc")}
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
              cardTitle={t("store_value")}
              cardDescription={t("store_value_desc")}
              types={
                [
                  'storevalue',
                ]
              }
              disableAverage={ false }
            />
            <LineChartStatistic
              cardTitle={t("storage_costs")}
              cardDescription={t("storage_costs_desc")}
              types={
                [
                  'storagecosts',
                ]
              }
              disableAverage={ false }
            />
            <LineChartStatistic
              cardTitle={t("delivery_reliability")}
              cardDescription={t("delivery_reliability_desc")}
              types={
                [
                  'deliveryreliability',
                ]
              }
              disableAverage={ false }
            />
            <LineChartStatistic
              cardTitle={t("sales")}
              cardDescription={t("sales_desc")}
              types={
                [
                  'salesquantity',
                ]
              }
              disableAverage={ false }
            />
            <LineChartStatistic
              cardTitle={t("capacity")}
              cardDescription={t("capacity_desc")}
              types={
                [
                  'possiblecapacity',
                  'productivetime'
                ]
              }
              disableAverage={ true }
            />
            <LineChartStatistic
              cardTitle={t("efficiency")}
              cardDescription={t("efficiency_desc")}
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
