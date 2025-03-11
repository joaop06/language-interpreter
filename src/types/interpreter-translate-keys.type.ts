import { NestedKeyPath } from "./nested-key-path.type";

/**
 * Definition of the generic JSON key type that accepts a dynamic set of structures
 */
export type InterpreterCodeKeys<T> = T extends unknown
  ? NestedKeyPath<T>
  : never;
