import type { Endpoint } from "..";
import type { DeepPartial, User, UserIdentifier } from "../../../types";
import type { CreateUserDto, UpdateUserDto } from "../../dtos";

export type UserEndpoints =
  | Endpoint<"GET", "/users", User[]>
  | Endpoint<"GET", "/users/:userId", User>
  | Endpoint<"GET", "/users/@me", User>
  | Endpoint<
      "GET",
      "/users/check/:identifier",
      {
        exists: boolean;
        identifier: DeepPartial<UserIdentifier>;
        suggestions?: string[];
      },
      { identifier: boolean; suggestions?: boolean }
    >
  | Endpoint<"POST", "/users", User, CreateUserDto>
  | Endpoint<"PATCH", "/users/:userId", void, UpdateUserDto>
  | Endpoint<"DELETE", "/users/:userId", void>;
