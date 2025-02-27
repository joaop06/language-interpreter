import { Logger } from "../helper/logger";

export class Exception extends Error {
    cause?: string;

    constructor(message: string, cause?: string) {
        super(message);
        this.cause = cause;
        this.name = 'Exception';

        // Preserva o stack trace corretamente
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        // Registra erro no Logger com mais informações
        new Logger().error(`${this.name}: ${message}${cause ? ` | Cause: ${cause}` : ''}`);
    }
}
