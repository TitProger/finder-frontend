import type { PageInfo, ProductCard, ProductListItem, ProductPhoto, SafeDossierReport } from "@shared/api-types";
import {
  apiClient,
  createDossiersApi,
  createProductsApi,
  isApiClientError,
  type ProductListQuery,
} from "@shared/api";

export type ProductListResult = {
  items: ProductListItem[];
  page: PageInfo | null;
};

function mediaUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/api/")) {
    return path;
  }

  const base = import.meta.env.VITE_API_URL ?? "/api";

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function withListMedia(item: ProductListItem): ProductListItem {
  return {
    ...item,
    photoUrl: item.photoUrl ? mediaUrl(item.photoUrl) : item.photoUrl,
  };
}

function withCardMedia(card: ProductCard): ProductCard {
  const photos: ProductPhoto[] = card.photos.map((photo) => ({
    ...photo,
    url: mediaUrl(photo.url),
  }));

  const delivery = card.delivery
    ? card.delivery
    : { available: false, demo: false, title: "2. Доставка" };

  return {
    ...card,
    photoUrl: card.photoUrl ? mediaUrl(card.photoUrl) : card.photoUrl,
    photos,
    delivery,
  };
}

/**
 * Безопасный отчёт → форма карточки сайта.
 * Контакты завода и сырая закупка в SafeDossierReport не приходят.
 */
function reportToCard(report: SafeDossierReport): ProductCard {
  const now = report.revalidateAt ?? new Date().toISOString();

  return {
    id: report.id,
    slug: report.id,
    name: report.name,
    categoryLabel: report.categoryLabel,
    chipLabel: null,
    photoUrl: report.photos[0]?.url ?? null,
    materialCount: report.specs.length,
    searchedAt: now,
    createdAt: now,
    updatedAt: report.revalidateAt,
    headline: report.name,
    cardCategoryLabel: report.categoryLabel,
    article: null,
    manufacturer: report.manufacturer ?? null,
    oemLabel: null,
    summaryTitle: null,
    summary: report.summary ?? null,
    availabilityLabel: null,
    demandLabel: null,
    galleryMoreLabel: null,
    verifiedLabel: "Проверено",
    updatedLabel: report.revalidateAt ? `перепроверка до ${report.revalidateAt.slice(0, 10)}` : null,
    specsTitle: "Характеристики и спецификация",
    passportLabel: null,
    photos: report.photos,
    specs: report.specs,
    procurement: report.procurement ?? null,
    delivery: report.delivery ?? { available: false, demo: false, title: "2. Доставка" },
    market: report.market ?? null,
    breakdown: report.breakdown ?? null,
  };
}

/**
 * История поиска и безопасный отчёт карточки.
 * Числа только из API (сид или утверждённое досье), не из JSX.
 */
export class ProductsService {
  private readonly api = createProductsApi(apiClient);
  private readonly dossiers = createDossiersApi(apiClient);

  async list(query: ProductListQuery): Promise<ProductListResult> {
    const page = await this.api.listProducts(query);

    return {
      items: page.items.map(withListMedia),
      page: page.page,
    };
  }

  async getById(id: string): Promise<ProductCard> {
    try {
      const data = await this.api.getProductById(id);

      if (data) {
        return withCardMedia(data);
      }
    } catch (error) {
      if (!isApiClientError(error) || error.httpStatus !== 404) {
        throw error;
      }
    }

    const report = await this.dossiers.getDossierReport(id);

    if (!report) {
      throw new Error("UNKNOWN_ERROR");
    }

    return withCardMedia(reportToCard(report));
  }
}

export const productsService = new ProductsService();
