import { APIResponse } from "../../rest";

/**
 * Generates a successful API response
 *
 * @param data Data to be sent in the response
 * @returns APIResponse
 */
export const formatResponse = <T>(data: T): APIResponse<T> => {
  return {
    success: true,
    data,
  };
};
