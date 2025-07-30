export type UndefinedToNull<
  T,
  StripOptional extends boolean = false,
> = T extends undefined
  ? null
  : T extends (infer U)[]
    ? UndefinedToNull<U, StripOptional>[]
    : T extends object
      ? StripOptional extends true
        ? { [K in keyof T]-?: UndefinedToNull<T[K], StripOptional> }
        : { [K in keyof T]: UndefinedToNull<T[K], StripOptional> }
      : T;

export const undefinedToNull = <T, StripOptional extends boolean = false>(
  undefinedObject: T,
  options?: { stripOptional?: StripOptional },
): UndefinedToNull<T, StripOptional> => {
  if (undefinedObject === undefined) {
    return null as UndefinedToNull<T, StripOptional>;
  }

  if (typeof undefinedObject !== "object" || undefinedObject === null) {
    return undefinedObject as UndefinedToNull<T, StripOptional>;
  }

  if (Array.isArray(undefinedObject)) {
    return undefinedObject.map(
      <U>(item: U): UndefinedToNull<U, StripOptional> =>
        undefinedToNull<U, StripOptional>(item, options),
    ) as unknown as UndefinedToNull<T, StripOptional>;
  }

  const result: Record<string, unknown> = {};

  const proto = Object.getPrototypeOf(undefinedObject) as unknown;
  if (proto !== undefined && proto !== Object.prototype) {
    Object.setPrototypeOf(result, proto);
  }

  for (const key of Object.keys(undefinedObject) as (keyof T)[]) {
    if (
      Object.prototype.hasOwnProperty.call(undefinedObject, key) !== undefined
    ) {
      const value = undefinedObject[key];
      result[key as string] = undefinedToNull(value, options);
    }
  }

  return result as UndefinedToNull<T, StripOptional>;
};
