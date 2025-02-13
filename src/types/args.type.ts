import { TypeMessage } from "./message.type";
import { TranslationKeys } from "./translation-keys.type";

export type ArgsType<T extends TypeMessage> =
    (
        | (
            | { [k: string]: any; }
            | string
        )[]
        | { [k: string]: any; }
    )
    & {
        field?: any,
        resource?: any,
        code?: TranslationKeys<T>,
    };