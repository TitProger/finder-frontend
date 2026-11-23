import type { TaxonomyPathSuggestion } from "@shared/api-types";
import { apiClient, createTaxonomyApi, type TaxonomyPathQuery } from "@shared/api";

/** Подсказки пути категории Wikkeo. */
export class TaxonomyService {
  private readonly api = createTaxonomyApi(apiClient);

  searchPaths(query: TaxonomyPathQuery): Promise<TaxonomyPathSuggestion[]> {
    return this.api.searchTaxonomyPaths(query);
  }
}

export const taxonomyService = new TaxonomyService();
