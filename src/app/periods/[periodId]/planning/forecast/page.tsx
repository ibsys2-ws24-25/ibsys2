import ForecastPageComponent from "@/components/pages/forecast/patchedForecast/ForecastPageComponent";
import { Forecast, PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

export interface ForecastProps {
    periodId: number;
    forecasts: Forecast[];
};

export default async function ForeCastPage({ params }: { params: { periodId: string } }) {
    const prisma = new PrismaClient();

    const period = await prisma.period.findUnique({
        where: { id: parseInt(params.periodId) },
        include: {
            Forecast: true,
        },
    });

    if (!period) {
        return notFound();
    }

    return (
        <ForecastPageComponent 
            periodId={ parseInt(params.periodId) }
            forecasts={ period.Forecast }
        />
    );
}