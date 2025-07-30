export type NullToUndefined<T> = T extends null
  ? undefined
  : T extends (infer U)[]
    ? NullToUndefined<U>[]
    : T extends object
      ? { [K in keyof T]: NullToUndefined<T[K]> }
      : T;

export const nullToUndefined = <T>(nullObject: T): NullToUndefined<T> => {
  if (nullObject === null) {
    return undefined as NullToUndefined<T>;
  }

  if (typeof nullObject !== "object") {
    return nullObject as NullToUndefined<T>;
  }

  if (Array.isArray(nullObject)) {
    return nullObject.map(
      <U>(item: U): NullToUndefined<U> => nullToUndefined<U>(item),
    ) as unknown as NullToUndefined<T>;
  }

  const result: Record<string, unknown> = {};

  const proto = Object.getPrototypeOf(nullObject) as unknown;
  if (proto !== undefined && proto !== Object.prototype) {
    Object.setPrototypeOf(result, proto);
  }

  for (const key of Object.keys(nullObject) as (keyof T)[]) {
    if (Object.prototype.hasOwnProperty.call(nullObject, key) !== undefined) {
      const value = nullObject[key];
      result[key as string] = nullToUndefined(value);
    }
  }

  return result as NullToUndefined<T>;
};
