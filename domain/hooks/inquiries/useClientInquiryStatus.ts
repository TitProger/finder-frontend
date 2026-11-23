import { useQuery } from "@tanstack/react-query";
import { clientInquiriesService } from "../../services/client-inquiries.service";

/** Честный статус заявки на поиске. Без процентов прогресса. */
export function useClientInquiryStatus(inquiryId: string | null) {
  return useQuery({
    queryKey: ["client-inquiry", inquiryId],
    queryFn: () => clientInquiriesService.getById(inquiryId!),
    enabled: Boolean(inquiryId),
    refetchInterval: (query) => {
      const status = query.state.data?.clientStatus;

      if (!status || status === "ready" || status === "error" || status === "no_results" || status === "partial") {
        return false;
      }

      return 3000;
    },
  });
}
