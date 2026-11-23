import type { ClientInquiry, CreateClientInquiryRequest } from "@shared/api-types";
import { apiClient, createClientInquiriesApi } from "@shared/api";

/** Клиентская заявка сайта. Без Telegram-полей. */
export class ClientInquiriesService {
  private readonly api = createClientInquiriesApi(apiClient);

  async create(body: CreateClientInquiryRequest): Promise<ClientInquiry> {
    const data = await this.api.createClientInquiry(body);

    if (!data) {
      throw new Error("UNKNOWN_ERROR");
    }

    return data;
  }

  async getById(id: string): Promise<ClientInquiry> {
    const data = await this.api.getClientInquiry(id);

    if (!data) {
      throw new Error("UNKNOWN_ERROR");
    }

    return data;
  }
}

export const clientInquiriesService = new ClientInquiriesService();
