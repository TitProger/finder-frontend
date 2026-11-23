import type {
  LogisticsQuoteRequest,
  LogisticsQuoteResult,
  MarginEstimateRequest,
  MarginEstimateResult,
  ProductDelivery,
} from "@shared/api-types";
import { apiClient, createRatesApi } from "@shared/api";

const UNAVAILABLE_DELIVERY: ProductDelivery = {
  available: false,
  demo: false,
  title: "2. Доставка",
};

/**
 * Калькуляторы ставок. Модель логистику не считает.
 * На карточке: без ставок — «недоступно»; demo — фикстура сида.
 */
export class RatesService {
  private readonly api = createRatesApi(apiClient);

  quote(body: LogisticsQuoteRequest): Promise<LogisticsQuoteResult | null> {
    return this.api.quoteLogistics(body);
  }

  estimateMargin(body: MarginEstimateRequest): Promise<MarginEstimateResult | null> {
    return this.api.estimateMargin(body);
  }

  /**
   * Quote → блок доставки карточки. unavailable и null → «недоступно».
   * Демо-фикстуру сида сюда не подменяет.
   */
  deliveryFromQuote(quote: LogisticsQuoteResult | null, title = "2. Доставка"): ProductDelivery {
    if (!quote || quote.status === "unavailable") {
      return { ...UNAVAILABLE_DELIVERY, title };
    }

    const transit =
      quote.transitDaysMin === quote.transitDaysMax
        ? `${quote.transitDaysMin} дн.`
        : `${quote.transitDaysMin}–${quote.transitDaysMax} дн.`;

    return {
      available: true,
      demo: false,
      title,
      modes: [quote.label],
      perUnit: {
        caption: `Логистика за 1 шт (при весе ${quote.weightKg} кг)`,
        price: formatRub(quote.perUnitRub),
        priceSuffix: "/ ед. товара",
        detail: `Тариф: ${quote.pricePerKg} ${quote.currency} / кг (${transit})`,
      },
      perBatch: {
        caption: `Доставка всей партии (${quote.quantity} шт)`,
        price: formatRub(quote.perBatchRub),
        priceSuffix: `общий вес ${round2(quote.weightKg * quote.quantity)} кг`,
        detail: quote.included[0] ? `Включено: ${quote.included[0]}` : null,
      },
      included: quote.included,
    };
  }
}

function formatRub(value: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export const ratesService = new RatesService();
