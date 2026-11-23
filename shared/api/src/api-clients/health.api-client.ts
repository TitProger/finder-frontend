import type { ApiClient } from "../common/api-client";
import { apiPaths } from "../../generated/paths";
import { unwrappers } from "../../generated/unwraps";

export function createHealthApi(client: ApiClient) {
  return {
    getHealth: () => client.getUnwrapped(apiPaths.health.getHealth, unwrappers.health.getHealth),
  };
}

export type HealthApi = ReturnType<typeof createHealthApi>;
