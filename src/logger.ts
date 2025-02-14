export class Logger {
    constructor(private id: string) { }

    log(message: string) {
        console.log(`[${this.id}] - ${message}`);
    }

    error(message: string) {
        console.error(`${new Date().toISOString()} [${this.id}] - Error: ${message}`);
    }
}