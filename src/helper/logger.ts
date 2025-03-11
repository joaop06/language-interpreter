import fs from "fs";

export class Logger {
  constructor(
    private _id?: string,
    private logFilePath?: string,
  ) {}

  get id() {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  private formatMessage(level: string, message: string, color: string): string {
    const timestamp = this.now();
    const idPart = this.id ? `[${this.id}] ` : "";
    return `${color}[${timestamp}] ${idPart}[${level.toUpperCase()}] - ${message}\x1b[0m`;
  }

  private saveToFile(logMessage: string) {
    if (this.logFilePath) {
      fs.appendFileSync(this.logFilePath, logMessage + "\n", "utf8");
    }
  }

  log(message: string) {
    const msg = this.formatMessage("log", message, "\x1b[37m"); // Branco
    console.log(msg);
    this.saveToFile(msg);
  }

  info(message: string) {
    const msg = this.formatMessage("info", message, "\x1b[34m"); // Azul
    console.info(msg);
    this.saveToFile(msg);
  }

  warn(message: string) {
    const msg = this.formatMessage("warn", message, "\x1b[33m"); // Amarelo
    console.warn(msg);
    this.saveToFile(msg);
  }

  error(message: string) {
    const msg = this.formatMessage("error", message, "\x1b[31m"); // Vermelho
    console.error(msg);
    this.saveToFile(msg);
  }

  debug(message: string) {
    if (process.env.DEBUG === "true") {
      const msg = this.formatMessage("debug", message, "\x1b[36m"); // Ciano
      console.debug(msg);
      this.saveToFile(msg);
    }
  }

  private now(): string {
    const date = new Date();
    const pad = (num: number) => num.toString().padStart(2, "0");

    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    );
  }
}
