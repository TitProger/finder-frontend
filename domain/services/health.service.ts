import type { HealthData } from "@shared/api-types";
import { apiClient, createHealthApi } from "@shared/api";

/**
 * Сервис health-check бэкенда.
 */
export class HealthService {
  private readonly api = createHealthApi(apiClient);

  async check(): Promise<HealthData> {
    const data = (await this.api.getHealth()) as HealthData | null | undefined;

    if (!data) {
      throw new Error("UNKNOWN_ERROR");
    }

    return data;
  }
}

export const healthService = new HealthService();
