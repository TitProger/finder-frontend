import { useMutation } from "@tanstack/react-query";
import type { CreateClientInquiryRequest } from "@shared/api-types";
import { clientInquiriesService } from "../../services/client-inquiries.service";
import { filesService } from "../../services/files.service";

export type SubmitSearchInquiryInput = {
  text: string;
  files: File[];
  profileJson: Record<string, string | null>;
  taxonomyNodeId?: number | null;
};

/** Загрузка фото и создание заявки. */
export function useCreateClientInquiry() {
  return useMutation({
    mutationFn: async (input: SubmitSearchInquiryInput) => {
      const mediaIds: string[] = [];

      for (const file of input.files) {
        const uploaded = await filesService.upload(file);
        mediaIds.push(uploaded.id);
      }

      const body: CreateClientInquiryRequest = {
        text: input.text,
        mediaIds,
        taxonomyNodeId: input.taxonomyNodeId ?? null,
        profileJson: input.profileJson,
      };

      return clientInquiriesService.create(body);
    },
  });
}
