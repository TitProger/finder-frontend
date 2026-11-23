import { useQuery } from "@tanstack/react-query";
import type { ProductListQuery } from "@shared/api";
import { productsService } from "../../services/products.service";
import { productKeys } from "./product.keys";

export function useProducts(query: ProductListQuery) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => productsService.list(query),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsService.getById(id),
    enabled: Boolean(id),
  });
}
