import { Logger } from "../helper/logger";

export class Exception extends Error {
    constructor(message: string, cause?: string) {
        const logger = new Logger();

        logger.error(message);
        throw super(message, { cause });
    }
}