export type HttpHeaders = Record<string, string>;

export type RequestOptions = RequestInit & {
  responseType?: "json";
};

/** Параметры path-шаблона (`/inquiries/{id}`, …). */
export type PathParams = Record<string, string | number>;

export type PathFn<TParams extends PathParams = PathParams> = ((params: TParams) => string) | string;
