export { ApiClient, createApiClient, apiClient } from "./common/api-client";
export { ApiClientError, isApiClientError, isApiErrorResponse, type ApiErrorBody } from "./error/api-client.error";
export { throwIfApiError } from "./error/error.handler";
export { createHealthApi, type HealthApi } from "./api-clients/health.api-client";
export { createSearchApi, type SearchApi } from "./api-clients/search.api-client";
export { createProductsApi, type ProductsApi, type ProductListQuery } from "./api-clients/products.api-client";
export { unwrapPagedList, type PagedApiResult } from "./contracts/paged";
