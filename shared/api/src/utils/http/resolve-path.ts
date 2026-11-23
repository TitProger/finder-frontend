import type { PathFn, PathParams } from "../../common/types";

export function resolvePath<TParams extends PathParams>(pathFn: PathFn<TParams>, params?: TParams): string {
  if (typeof pathFn === "function") {
    return pathFn((params ?? {}) as TParams);
  }

  return pathFn;
}
