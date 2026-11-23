import type { SafeDossierReport } from "../../generated/types";
import { apiPaths } from "../../generated/paths";
import { unwrappers } from "../../generated/unwraps";
import type { ApiClient } from "../common/api-client";

export function createDossiersApi(client: ApiClient) {
  return {
    getDossierReport: (id: string) =>
      client.getUnwrapped(
        apiPaths.dossiers.getDossierReport,
        unwrappers.dossiers.getDossierReport,
        { id },
      ) as Promise<SafeDossierReport | null>,
  };
}

export type DossiersApi = ReturnType<typeof createDossiersApi>;
