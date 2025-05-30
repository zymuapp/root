export const PROTO_PATHS = {
  AUTH: require.resolve("./protos/auth.proto"),
  USER: require.resolve("./protos/user.proto"),
  COMMON: require.resolve("./protos/common.proto"),
} as const;

export * from "./constants";
export * from "./grpc";
export * from "./rest";
export * from "./sdk";
export * from "./types";
export * from "./errors/grpc-errors";
export * from "./utils";

export type * from "pathcat";
