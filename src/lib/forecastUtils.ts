import { Forecast } from "@prisma/client";

/**
 * Findet ein Forecast-Objekt basierend auf dem Produkt und der Zielperiode.
 * @param forecasts - Array von Forecast-Objekten.
 * @param productId - Die Material-ID (productId), die gesucht wird.
 * @param periodId - Die Zielperiode (forPeriod), die gesucht wird.
 * @returns Das passende Forecast-Objekt oder undefined, wenn keines gefunden wird.
 */
export function getForecastObjectByProductAndPeriod(
  forecasts: Forecast[],
  productId: string,
  periodId: number
): Forecast | undefined {
  return forecasts.find(
    (fc) => fc.materialId === productId && fc.forPeriod === periodId
  );
}