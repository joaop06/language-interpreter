import { TypeMessage } from "./message.type";
import { ErrorsType } from "./json-errors.type";
import { SuccessType } from "./json-success.type";
import { NestedKeyPath } from "./nested-key-path.type";

// Define o tipo das chaves do JSON de exemplo
export type TranslationKeys<T extends TypeMessage> = T extends 'ERROR'
    ? NestedKeyPath<ErrorsType>
    : T extends 'SUCCESS'
    ? NestedKeyPath<SuccessType>
    : never;