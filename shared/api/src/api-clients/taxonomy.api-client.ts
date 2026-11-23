import type { TaxonomyPathSuggestion } from "../../generated/types";
import { apiPaths } from "../../generated/paths";
import { unwrappers } from "../../generated/unwraps";
import type { ApiClient } from "../common/api-client";
import { withQuery } from "../utils/query";

export type TaxonomyPathQuery = {
  q: string;
  limit?: number;
  parentId?: number;
};

export function createTaxonomyApi(client: ApiClient) {
  return {
    searchTaxonomyPaths: async (query: TaxonomyPathQuery): Promise<TaxonomyPathSuggestion[]> => {
      const data = await client.getUnwrapped(
        withQuery(apiPaths.taxonomy.searchTaxonomyPaths, query),
        unwrappers.taxonomy.searchTaxonomyPaths,
      );

      return (data ?? []) as TaxonomyPathSuggestion[];
    },
  };
}

export type TaxonomyApi = ReturnType<typeof createTaxonomyApi>;
