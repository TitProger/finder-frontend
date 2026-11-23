import { useQuery } from "@tanstack/react-query";
import { taxonomyService } from "../../services/taxonomy.service";

/** Подсказки пути. Пустой q — запрос не шлём. */
export function useTaxonomyPathSearch(q: string, limit = 12) {
  const trimmed = q.trim();

  return useQuery({
    queryKey: ["taxonomy", "paths", trimmed, limit],
    queryFn: () => taxonomyService.searchPaths({ q: trimmed, limit }),
    enabled: trimmed.length >= 1,
  });
}
