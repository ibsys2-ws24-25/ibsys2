'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "react-google-charts";
import { Skeleton } from "../ui/skeleton";

export interface LineChartStatisticProps {
  cardTitle: string;
  cardDescription: string;
  types: string[];
  disableAverage: boolean;
}

export default function LineChartStatistic({
  cardTitle,
  cardDescription,
  types,
  disableAverage,
}: LineChartStatisticProps) {
  const [chartData, setChartData] = useState<(string | number)[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<{ [index: number]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data: { [periodId: number]: { [key: string]: number } } = {};
        const periods = new Set<number>();

        for (const type of types) {
          const response = await fetch(`/api/statistic/${type}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data for type: ${type}`);
          }
          const result = await response.json();

          result.forEach((stat: { periodId: number; current: number; average: number }) => {
            if (!data[stat.periodId]) {
              data[stat.periodId] = {};
            }
            data[stat.periodId][`${type}-current`] = stat.current;
            if (!disableAverage) {
              data[stat.periodId][`${type}-average`] = stat.average;
            }
            periods.add(stat.periodId);
          });
        }

        const sortedPeriods = Array.from(periods).sort((a, b) => a - b);
        const chartDataArray: (string | number)[][] = [
          ["Period", ...types.flatMap((type) => [`${type} Current`, ...(disableAverage ? [] : [`${type} Average`])])],
        ];

        sortedPeriods.forEach((periodId) => {
          const row: (string | number)[] = [periodId];
          types.forEach((type) => {
            row.push(data[periodId]?.[`${type}-current`] ?? 0);
            if (!disableAverage) {
              row.push(data[periodId]?.[`${type}-average`] ?? 0);
            }
          });
          chartDataArray.push(row);
        });

        setChartData(chartDataArray);

        const initialVisibleSeries = Object.fromEntries(chartDataArray[0].slice(1).map((_, index) => [index, true]));
        setVisibleSeries(initialVisibleSeries);
      } catch (err) {
        console.error(err);
        setError("No data available yet! Please upload at least one period.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [types, disableAverage]);

  const handleLegendClick = (seriesIndex: number) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [seriesIndex]: !prev[seriesIndex],
    }));
  };

  if (error) {
    return <p>{error}</p>;
  }

  const seriesOptions = Object.keys(visibleSeries).reduce((acc, key) => {
    acc[parseInt(key, 10)] = visibleSeries[parseInt(key, 10)]
      ? {}
      : { color: "transparent", lineWidth: 0 };
    return acc;
  }, {} as { [index: number]: unknown });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <Skeleton className="h-[400px]" />}
          {!loading && (
            <Chart
              className="overflow-hidden"
              chartType="LineChart"
              data={chartData}
              width="100%"
              height="400px"
              options={{
                title: cardTitle,
                hAxis: { title: "Periods", format: "0" },
                vAxis: { title: "Values" },
                legend: {
                  position: "bottom",
                  alignment: "center",
                  maxLines: 2,
                },
                series: seriesOptions,
                colors: types.flatMap(() => ["#0000FF", ...(disableAverage ? [] : ["#FF0000"])]),
              }}
              chartEvents={[
                {
                  eventName: "select",
                  callback: ({ chartWrapper }) => {
                    if (chartWrapper) {
                      const chart = chartWrapper.getChart();
                      const selection = chart.getSelection();
                      if (selection.length > 0) {
                        const legendIndex = selection[0].column - 1;
                        if (legendIndex >= 0) {
                          handleLegendClick(legendIndex);
                        }
                      }
                    }
                  },
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}