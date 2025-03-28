import type { Options } from "redaxios";
import type { AuthEndpoints } from "./auth";
import type { UserEndpoints } from "./user";

export type Endpoint<
	M extends Options["method"],
	Path extends string,
	Res,
	Body = undefined,
> = {
	method: M;
	path: Path;
	res: Res;
	body: Body;
};

export type Endpoints = AuthEndpoints | UserEndpoints;
