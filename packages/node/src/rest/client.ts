import { type ParamValue, type Query, pathcat } from "pathcat";
import type { Options, Response as RedaxiosResponse } from "redaxios";
import { type HttpRequestOptions, request } from "..";
import { DEFAULT_API_URL } from "../constants";
import type { Endpoints } from "./endpoints";

export type SuccessfulHttpResponse<T> = {
  success: true;
  data: T;
};

export type ErroredHttpResponse = {
  success: false;
  message: string;
  statusCode: number;
  errors?: {
    [key: string]: string[];
  };
};

export type HttpResponse<T> = SuccessfulHttpResponse<T> | ErroredHttpResponse;

export type PromisedHttpResponse<T> = Promise<HttpResponse<T>>;

export type HttpPathsFor<M extends Options["method"]> = Extract<
  Endpoints,
  { method: M }
>["path"];

export type ResponseFor<
  M extends Options["method"],
  P extends HttpPathsFor<M>,
> = Extract<Endpoints, { method: M; path: P }>["res"];

export type Response<
  M extends Options["method"],
  P extends HttpPathsFor<M>,
> = HttpResponse<Extract<Endpoints, { method: M; path: P }>["res"]>;

export type PromisedEndpointResponse<
  M extends Options["method"],
  P extends HttpPathsFor<M>,
> = PromisedHttpResponse<Extract<Endpoints, { method: M; path: P }>["res"]>;

export type Body<
  M extends Options["method"],
  P extends HttpPathsFor<M>,
> = Extract<Endpoints, { method: M; path: P }>["body"];

export type StringifiedQueryValue = string | string[];

export type StringifiedQuery<T> = {
  [K in keyof T]: StringifiedQueryValue;
};

export type QueryParams<
  M extends Options["method"],
  P extends HttpPathsFor<M>,
> = StringifiedQuery<Extract<Endpoints, { method: M; path: P }>["body"]>;

export class HttpError<T> extends Error {
  public readonly status: number;

  constructor(
    public readonly response: RedaxiosResponse<HttpResponse<T>>,
    public readonly data: ErroredHttpResponse,
  ) {
    super(data.message);

    this.status = response.status;
  }
}

export interface ClientOptions {
  readonly baseURL: string;
}

export class Client {
  private options;
  public readonly url;

  constructor(options: ClientOptions) {
    this.options = options;
    this.url = (path: string, params: Record<string, ParamValue>) => {
      const baseURL = this.options.baseURL || DEFAULT_API_URL;
      return pathcat(baseURL, path, params);
    };
  }

  setOptions(options: ClientOptions) {
    this.options = options;
  }

  async get<Path extends HttpPathsFor<"GET">>(
    path: Path,
    query?: Query<Path>,
    options?: HttpRequestOptions,
  ) {
    return this.requester<ResponseFor<"GET", Path>>(
      "GET",
      path,
      undefined,
      query,
      options,
    );
  }

  async post<Path extends HttpPathsFor<"POST">>(
    path: Path,
    body: Body<"POST", Path>,
    query?: Query<Path>,
    options?: HttpRequestOptions,
  ) {
    return this.requester<ResponseFor<"POST", Path>>(
      "POST",
      path,
      body,
      query,
      options,
    );
  }

  async put<Path extends HttpPathsFor<"PUT">>(
    path: Path,
    body: Body<"PUT", Path>,
    query?: Query<Path>,
    options?: HttpRequestOptions,
  ) {
    return this.requester<ResponseFor<"PUT", Path>>(
      "PUT",
      path,
      body,
      query,
      options,
    );
  }

  async patch<Path extends HttpPathsFor<"PATCH">>(
    path: Path,
    body: Body<"PATCH", Path>,
    query?: Query<Path>,
    options?: HttpRequestOptions,
  ) {
    return this.requester<ResponseFor<"PATCH", Path>>(
      "PATCH",
      path,
      body,
      query,
      options,
    );
  }

  async delete<Path extends HttpPathsFor<"DELETE">>(
    path: Path,
    body: Body<"DELETE", Path>,
    query?: Query<Path>,
    options?: HttpRequestOptions,
  ) {
    return this.requester<ResponseFor<"DELETE", Path>>(
      "DELETE",
      path,
      body,
      query,
      options,
    );
  }

  private async requester<T>(
    method: Options["method"],
    path: string,
    body: unknown,
    query: Query<string> = {},
    options: HttpRequestOptions = {},
  ) {
    const url = this.url(path, query);

    if (body !== undefined) {
      if (method === "GET") {
        throw new Error("Cannot send a GET request with a body");
      }
    }

    const response: RedaxiosResponse<HttpResponse<T>> = await request<T>(url, {
      method,
      data: body,
      ...options,
    });

    const result = response.data;

    if (!result.success) {
      throw new HttpError<T>(response, result);
    }

    return result.data;
  }
}
