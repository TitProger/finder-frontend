import type { SearchPack } from "@shared/api-types";
import { apiClient, createSearchApi } from "@shared/api";

/** Пачка вопросов и категории первой страницы. */
export class SearchService {
  private readonly api = createSearchApi(apiClient);

  async getPack(): Promise<SearchPack> {
    const data = (await this.api.getSearchPack()) as SearchPack | null | undefined;

    if (!data) {
      throw new Error("UNKNOWN_ERROR");
    }

    return data;
  }
}

export const searchService = new SearchService();
