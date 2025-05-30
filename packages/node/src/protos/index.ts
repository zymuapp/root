/**
 * Proto file paths for gRPC service definitions
 * These can be used to load proto files in gRPC clients/servers
 */
import { join } from "node:path";

// Export the directory path containing proto files
export const PROTO_DIR = __dirname;

// Export individual proto file paths
export const PROTO_FILES = {
  auth: join(__dirname, "auth.proto"),
  common: join(__dirname, "common.proto"),
  user: join(__dirname, "user.proto"),
} as const;

// Export proto file contents as strings (useful for some gRPC libraries)
export const getProtoPath = (protoName: keyof typeof PROTO_FILES): string => {
  return PROTO_FILES[protoName];
};

// Helper to get all proto files
export const getAllProtoFiles = (): string[] => {
  return Object.values(PROTO_FILES);
};
