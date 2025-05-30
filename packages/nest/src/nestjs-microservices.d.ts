import type { ServiceNames, GrpcMethodsFor } from "zymu";

declare module "@nestjs/microservices" {
  /**
   * Type-safe gRPC method decorator that only accepts valid service names and their methods
   *
   * @example
   * ```typescript
   * @GrpcMethod("AuthService", "SignUp")
   * async signUp(data: SignUpRequest): Promise<AuthResponse> {
   *   // Implementation
   * }
   *
   * @GrpcMethod("UserService", "GetUser")
   * async getUser(data: GetUserRequest): Promise<UserResponse> {
   *   // Implementation
   * }
   * ```
   */
  export const GrpcMethod: <
    Service extends ServiceNames,
    Method extends GrpcMethodsFor<Service>,
  >(
    service: Service,
    method?: Method,
  ) => MethodDecorator;
}
