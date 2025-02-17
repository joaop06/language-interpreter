export class Logger {
    constructor(private _id?: string) { }

    set id(value: string) {
        this._id = value;
    }

    now(): string {
        return new Date().toISOString();
    }

    log(message: string) {
        if (this._id) console.log(`[${this.now()}] - ${message}`);
        else console.log(`[${this.now()}] [${this.id}] - ${message}`);
    }

    error(message: string) {
        if (this._id) console.error(`${this.now()} - Error: ${message}`);
        else console.error(`${this.now()} [${this.id}] - Error: ${message}`);
    }
}