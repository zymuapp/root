import * as zymu from "zymu";

declare module "@nestjs/common" {
  export const Get: <Path extends zymu.PathsFor<"GET">>(
    path: Path,
  ) => MethodDecorator;

  export const Post: <
    Path extends Extract<zymu.Endpoints, { method: "POST" }>["path"],
  >(
    path: Path,
  ) => MethodDecorator;

  export const Put: <
    Path extends Extract<zymu.Endpoints, { method: "PUT" }>["path"],
  >(
    path: Path,
  ) => MethodDecorator;

  export const Patch: <
    Path extends Extract<zymu.Endpoints, { method: "PATCH" }>["path"],
  >(
    path: Path,
  ) => MethodDecorator;

  export const Delete: <
    Path extends Extract<zymu.Endpoints, { method: "DELETE" }>["path"],
  >(
    path: Path,
  ) => MethodDecorator;
}
