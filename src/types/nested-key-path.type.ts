/**
 * Definition of the key/message path in the JSON file based on the T type,
 * which is the union of the types that represent the JSON key structures.
 */
export type NestedKeyPath<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}.${NestedKeyPath<T[K]>}`
        : `${K & string}`;
    }[keyof T]
  : string;
