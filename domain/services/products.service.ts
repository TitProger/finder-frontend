import type { PageInfo, ProductCard, ProductListItem, ProductPhoto } from "@shared/api-types";
import { apiClient, createProductsApi, type ProductListQuery } from "@shared/api";

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

  return {
    ...card,
    photoUrl: card.photoUrl ? mediaUrl(card.photoUrl) : card.photoUrl,
    photos,
  };
}

/**
 * История поиска и карточка. Числа остаются в ответе API.
 */
export class ProductsService {
  private readonly api = createProductsApi(apiClient);

  async list(query: ProductListQuery): Promise<ProductListResult> {
    const page = await this.api.listProducts(query);

    return {
      items: page.items.map(withListMedia),
      page: page.page,
    };
  }

  async getById(id: string): Promise<ProductCard> {
    const data = await this.api.getProductById(id);

    if (!data) {
      throw new Error("UNKNOWN_ERROR");
    }

    return withCardMedia(data);
  }
}

export const productsService = new ProductsService();
