import { useQuery } from "@tanstack/react-query";
import { searchService } from "../../services/search.service";

export function useSearchPack() {
  return useQuery({
    queryKey: ["search", "pack"],
    queryFn: () => searchService.getPack(),
  });
}
