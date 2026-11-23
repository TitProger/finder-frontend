import type {
  LogisticsQuoteRequest,
  LogisticsQuoteResult,
  MarginEstimateRequest,
  MarginEstimateResult,
} from "../../generated/types";
import { apiPaths } from "../../generated/paths";
import { unwrappers } from "../../generated/unwraps";
import type { ApiClient } from "../common/api-client";

/**
 * Публичные калькуляторы ставок. Книга по умолчанию пустая.
 */
export function createRatesApi(client: ApiClient) {
  return {
    quoteLogistics: (body: LogisticsQuoteRequest) =>
      client.postUnwrapped(
        apiPaths.rates.quoteLogistics,
        unwrappers.rates.quoteLogistics,
        body,
      ) as Promise<LogisticsQuoteResult | null>,
    estimateMargin: (body: MarginEstimateRequest) =>
      client.postUnwrapped(
        apiPaths.rates.estimateMargin,
        unwrappers.rates.estimateMargin,
        body,
      ) as Promise<MarginEstimateResult | null>,
  };
}

export type RatesApi = ReturnType<typeof createRatesApi>;
