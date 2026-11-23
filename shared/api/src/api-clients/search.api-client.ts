import type { ApiClient } from "../common/api-client";
import { apiPaths } from "../../generated/paths";
import { unwrappers } from "../../generated/unwraps";

export function createSearchApi(client: ApiClient) {
  return {
    getSearchPack: () => client.getUnwrapped(apiPaths.search.getSearchPack, unwrappers.search.getSearchPack),
  };
}

export type SearchApi = ReturnType<typeof createSearchApi>;
