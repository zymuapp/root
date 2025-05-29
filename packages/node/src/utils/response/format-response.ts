import { APIResponse } from "../../rest";

/**
 * Generates a successful API response
 *
 * @param data Data or Promise of data to be sent in the response
 * @returns APIResponse
 */
export const formatResponse = async <T>(
  data: T | Promise<T>,
): Promise<APIResponse<T>> => {
  return {
    success: true,
    data: await Promise.resolve(data),
  };
};
