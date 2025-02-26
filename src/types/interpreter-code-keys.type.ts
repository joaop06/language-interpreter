import { NestedKeyPath } from "./nested-key-path.type";

/**
 * Definição do tipo genérico das chaves JSON
 * que aceita um conjunto dinâmico de estruturas
 */
export type InterpreterCodeKeys<T> = T extends unknown ? NestedKeyPath<T> : never;
