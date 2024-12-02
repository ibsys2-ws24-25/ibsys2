import { Forecast, ProductionPlanDecision, Warehouse } from "@prisma/client";

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

/**
 * Findet ein ProdDecision-Objekt basierend auf dem Produkt und der Zielperiode.
 * @param decisions - Array von ProdDecision-Objekten.
 * @param productId - Die Material-ID (productId), die gesucht wird.
 * @param periodId - Die Zielperiode (forPeriod), die gesucht wird.
 * @returns Das passende Forecast-Objekt oder undefined, wenn keines gefunden wird.
 */
export function getDecisionObjectByProductAndPeriod(
    decisions: ProductionPlanDecision[],
    productId: string,
    periodId: number
): ProductionPlanDecision | undefined {
    return decisions.find(
        (dc) => dc.materialId === productId && dc.forPeriod === periodId
    );
}

export function getWarehouseStock(warhouse: Warehouse[], materialId: string): Warehouse | undefined {
    return warhouse.find((wh) => wh.materialId === materialId);
}
