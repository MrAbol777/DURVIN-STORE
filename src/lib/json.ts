export type JsonSafe<T> = T extends bigint
  ? string
  : T extends Date
    ? string
    : T extends Array<infer Item>
      ? JsonSafe<Item>[]
      : T extends object
        ? { [Key in keyof T]: JsonSafe<T[Key]> }
        : T;

/** Converts Prisma BigInt values to strings before they are returned in JSON responses. */
export function toJsonSafe<T>(value: T): JsonSafe<T> {
  return JSON.parse(
    JSON.stringify(value, (_key, currentValue) =>
      typeof currentValue === "bigint" ? currentValue.toString() : currentValue,
    ),
  ) as JsonSafe<T>;
}
