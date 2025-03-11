/**
 * Definição do código/caminho da mensagem
 * baseada no tipo T que é a união dos tipos que representam as estruturas das chaves JSON
 */
export type NestedKeyPath<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}.${NestedKeyPath<T[K]>}`
        : `${K & string}`;
    }[keyof T]
  : string;
