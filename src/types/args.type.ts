import { TypeMessage } from "./message.type";
import { InterpreterCodeKeys } from "./interpreter-code-keys.type";

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
        code?: InterpreterCodeKeys<T>,
    };