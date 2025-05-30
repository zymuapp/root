import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import {
  Endpoints,
  Client,
  DEFAULT_API_URL,
  Query,
  HttpPathsFor,
  HttpError,
  HttpRequestOptions,
} from "zymu";

export const client = new Client({ baseURL: DEFAULT_API_URL });

type AnyEndpoint = Endpoints extends infer T ? T : never;

type ForceAccept<T> = T extends never ? unknown : T;

export type ResponseType<Path extends HttpPathsFor<"GET">> = ForceAccept<
  Extract<AnyEndpoint, { path: Path; method: "GET" }>["res"]
>;

export type ErrorType<Path extends HttpPathsFor<"GET">> = HttpError<
  ResponseType<Path>
>;

export interface UseAPIConfig<Path extends HttpPathsFor<"GET">>
  extends SWRConfiguration<ResponseType<Path>, ErrorType<Path>> {
  requestOptions?: HttpRequestOptions;
}

export function useAPI<Path extends HttpPathsFor<"GET">>(
  path: Path | null | undefined,
  query?: Query<Path>,
  config?: UseAPIConfig<Path>,
): SWRResponse<ResponseType<Path>, ErrorType<Path>> {
  const { requestOptions, ...swrConfig } = config || {};

  const fetcher = async ([fetchPath, fetchQuery]: [
    Path,
    Query<Path> | undefined,
  ]) => {
    const response = await client.get(fetchPath, fetchQuery, requestOptions);
    return response as unknown as ResponseType<Path>;
  };

  return useSWR<
    ResponseType<Path>,
    ErrorType<Path>,
    [Path, Query<Path> | undefined] | null
  >(path ? [path, query] : null, fetcher, swrConfig);
}
