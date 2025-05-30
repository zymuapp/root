import { HttpResponse } from "../../rest";

/**
 * Generates a successful HTTP response
 *
 * @param data Data or Promise of data to be sent in the response
 * @returns HttpResponse
 */
export const formatHttpResponse = async <T>(
  data: T | Promise<T>,
): Promise<HttpResponse<T>> => {
  return {
    success: true,
    data: await Promise.resolve(data),
  };
};
