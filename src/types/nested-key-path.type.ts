export type NestedKeyPath<T> = T extends object
    ? { [K in keyof T]: T[K] extends object
        ? `${K & string}.${NestedKeyPath<T[K]>}`
        : `${K & string}`
    }[keyof T]
    : string;
