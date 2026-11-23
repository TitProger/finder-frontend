import type { ProductCard, ProductListItem } from "../../generated/types";
import { apiPaths } from "../../generated/paths";
import { unwrappers } from "../../generated/unwraps";
import type { ApiClient } from "../common/api-client";
import { unwrapPagedList, type PagedApiResult } from "../contracts/paged";
import { withQuery } from "../utils/query";

export type ProductListQuery = {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
};

export function createProductsApi(client: ApiClient) {
  return {
    listProducts: async (query?: ProductListQuery): Promise<PagedApiResult<ProductListItem>> => {
      const response = await client.get(withQuery(apiPaths.products.listProducts, query));

      return unwrapPagedList<ProductListItem>(response);
    },
    getProductById: (id: string) =>
      client.getUnwrapped(apiPaths.products.getProductById, unwrappers.products.getProductById, { id }) as Promise<
        ProductCard | null
      >,
  };
}

export type ProductsApi = ReturnType<typeof createProductsApi>;
