import { httpRequest } from "../utils/http/request";
import { resolvePath } from "../utils/http/resolve-path";
import { serializeBody } from "../utils/http/serialize-body";
import type { PathFn, PathParams } from "./types";
import { TokenStorage } from "./token-storage";

/**
 * Базовый HTTP-клиент API.
 * Ответ приходит конвертом. Разбор `data` делает unwrapper.
 */
export class ApiClient {
  private readonly tokenStorage = new TokenStorage();
  private readonly baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  setToken(token: string): void {
    this.tokenStorage.set(token);
  }

  getToken(): string | null {
    return this.tokenStorage.get();
  }

  clearToken(): void {
    this.tokenStorage.clear();
  }

  private request<T>(path: string, options: RequestInit = {}) {
    return httpRequest<T>(this.baseUrl, path, this.tokenStorage, options);
  }

  private executeGet<T, TParams extends PathParams>(pathFn: PathFn<TParams>, params?: TParams): Promise<T> {
    return this.request(resolvePath(pathFn, params), { method: "GET" });
  }

  private executePost<T, TParams extends PathParams>(
    pathFn: PathFn<TParams>,
    data: unknown | undefined,
    params?: TParams,
  ): Promise<T> {
    return this.request(resolvePath(pathFn, params), {
      method: "POST",
      body: serializeBody(data),
    });
  }

  private executePut<T, TParams extends PathParams>(
    pathFn: PathFn<TParams>,
    data: unknown | undefined,
    params?: TParams,
  ): Promise<T> {
    return this.request(resolvePath(pathFn, params), {
      method: "PUT",
      body: serializeBody(data),
    });
  }

  private executePatch<T, TParams extends PathParams>(
    pathFn: PathFn<TParams>,
    data: unknown | undefined,
    params?: TParams,
  ): Promise<T> {
    return this.request(resolvePath(pathFn, params), {
      method: "PATCH",
      body: serializeBody(data),
    });
  }

  private executeDelete<T, TParams extends PathParams>(pathFn: PathFn<TParams>, params?: TParams): Promise<T> {
    return this.request(resolvePath(pathFn, params), { method: "DELETE" });
  }

  async get<T = unknown>(pathFn: string): Promise<T>;
  async get<T = unknown, TParams extends PathParams = PathParams>(
    pathFn: (params: TParams) => string,
    params: TParams,
  ): Promise<T>;
  async get<T = unknown, TParams extends PathParams = PathParams>(
    pathFn: PathFn<TParams>,
    params?: TParams,
  ): Promise<T> {
    return this.executeGet(pathFn, params);
  }

  async getUnwrapped<TResult>(pathFn: string, unwrapper: (response: unknown) => TResult): Promise<TResult>;
  async getUnwrapped<TResult, TParams extends PathParams = PathParams>(
    pathFn: (params: TParams) => string,
    unwrapper: (response: unknown) => TResult,
    params: TParams,
  ): Promise<TResult>;
  async getUnwrapped<TResult, TParams extends PathParams = PathParams>(
    pathFn: PathFn<TParams>,
    unwrapper: (response: unknown) => TResult,
    params?: TParams,
  ): Promise<TResult> {
    const response = await this.executeGet(pathFn, params);

    return unwrapper(response);
  }

  async post<T = unknown>(pathFn: string, data?: unknown): Promise<T>;
  async post<T = unknown, TParams extends PathParams = PathParams>(
    pathFn: (params: TParams) => string,
    data: unknown | undefined,
    params: TParams,
  ): Promise<T>;
  async post<T = unknown, TParams extends PathParams = PathParams>(
    pathFn: PathFn<TParams>,
    data?: unknown,
    params?: TParams,
  ): Promise<T> {
    return this.executePost(pathFn, data, params);
  }

  async postUnwrapped<TResult>(
    pathFn: string,
    unwrapper: (response: unknown) => TResult,
    data?: unknown,
  ): Promise<TResult>;
  async postUnwrapped<TResult, TParams extends PathParams = PathParams>(
    pathFn: (params: TParams) => string,
    unwrapper: (response: unknown) => TResult,
    data: unknown | undefined,
    params: TParams,
  ): Promise<TResult>;
  async postUnwrapped<TResult, TParams extends PathParams = PathParams>(
    pathFn: PathFn<TParams>,
    unwrapper: (response: unknown) => TResult,
    data?: unknown,
    params?: TParams,
  ): Promise<TResult> {
    const response = await this.executePost(pathFn, data, params);

    return unwrapper(response);
  }

  /** Multipart без Content-Type: boundary ставит браузер. */
  async postFormUnwrapped<TResult>(
    pathFn: string,
    unwrapper: (response: unknown) => TResult,
    form: FormData,
  ): Promise<TResult> {
    const response = await this.request(resolvePath(pathFn), {
      method: "POST",
      body: form,
    });

    return unwrapper(response);
  }

  async put<T = unknown>(pathFn: string, data?: unknown): Promise<T>;
  async put<T = unknown, TParams extends PathParams = PathParams>(
    pathFn: (params: TParams) => string,
    data: unknown | undefined,
    params: TParams,
  ): Promise<T>;
  async put<T = unknown, TParams extends PathParams = PathParams>(
    pathFn: PathFn<TParams>,
    data?: unknown,
    params?: TParams,
  ): Promise<T> {
    return this.executePut(pathFn, data, params);
  }

  async patch<T = unknown>(pathFn: string, data?: unknown): Promise<T>;
  async patch<T = unknown, TParams extends PathParams = PathParams>(
    pathFn: (params: TParams) => string,
    data: unknown | undefined,
    params: TParams,
  ): Promise<T>;
  async patch<T = unknown, TParams extends PathParams = PathParams>(
    pathFn: PathFn<TParams>,
    data?: unknown,
    params?: TParams,
  ): Promise<T> {
    return this.executePatch(pathFn, data, params);
  }

  async delete<T = unknown>(pathFn: string): Promise<T>;
  async delete<T = unknown, TParams extends PathParams = PathParams>(
    pathFn: (params: TParams) => string,
    params: TParams,
  ): Promise<T>;
  async delete<T = unknown, TParams extends PathParams = PathParams>(
    pathFn: PathFn<TParams>,
    params?: TParams,
  ): Promise<T> {
    return this.executeDelete(pathFn, params);
  }
}

export function createApiClient(baseUrl?: string): ApiClient {
  return new ApiClient(baseUrl);
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_URL ?? "/api");
