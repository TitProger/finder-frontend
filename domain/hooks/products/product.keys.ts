import type { ProductListQuery } from "@shared/api";

export const productKeys = {
  all: ["products"] as const,
  list: (query: ProductListQuery) => ["products", "list", query] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};
