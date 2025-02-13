// export type NestedKeyPath<T> = {
//     [K in keyof T]: T[K] extends Record<string, any>
//     ? `${K & string}.${NestedKeyPath<T[K]>}`
//     : T[K] extends string
//     ? `${K & string}`
//     : never;
// }[keyof T];



export type NestedKeyPath<T, Depth extends number = 6> = {
    [K in keyof T]: T[K] extends Record<string, any>
    ? Depth extends 0
    ? never
    : `${K & string}.${NestedKeyPath<T[K], Prev[Depth]>}`
    : T[K] extends string
    ? `${K & string}`
    : never;
}[keyof T];

type Prev = [never, 0, 1, 2, 3, 4, 5, 6]; // Limita a profundidade para 6
