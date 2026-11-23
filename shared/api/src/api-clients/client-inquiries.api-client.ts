import type { ClientInquiry, CreateClientInquiryRequest } from "../../generated/types";
import { apiPaths } from "../../generated/paths";
import { unwrappers } from "../../generated/unwraps";
import type { ApiClient } from "../common/api-client";

export function createClientInquiriesApi(client: ApiClient) {
  return {
    createClientInquiry: (body: CreateClientInquiryRequest) =>
      client.postUnwrapped(
        apiPaths.client_inquiries.createClientInquiry,
        unwrappers.client_inquiries.createClientInquiry,
        body,
      ) as Promise<ClientInquiry | null>,
    getClientInquiry: (id: string) =>
      client.getUnwrapped(
        apiPaths.client_inquiries.getClientInquiry({ id }),
        unwrappers.client_inquiries.getClientInquiry,
      ) as Promise<ClientInquiry | null>,
  };
}

export type ClientInquiriesApi = ReturnType<typeof createClientInquiriesApi>;
