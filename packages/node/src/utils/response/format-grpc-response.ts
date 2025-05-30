import { GrpcResponse } from "../../grpc";

/**
 * Generates a successful gRPC response
 *
 * @param data Data or Promise of data to be sent in the response
 * @returns GrpcResponse
 */
export const formatGrpcResponse = async <T>(
  data: T | Promise<T>,
): Promise<GrpcResponse<T>> => {
  return {
    success: true,
    data: await Promise.resolve(data),
  };
};
