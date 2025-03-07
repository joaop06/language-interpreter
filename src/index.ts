import { resolve } from "path";
import { existsSync } from "fs";
import { Logger } from "./helper/logger";
import { Exception } from "./helper/exception";
import { FileLoader } from "./files/file-loader";
import { Config } from "./interfaces/config.interface";
import { InterpreterCodeKeys } from "./types/interpreter-code-keys.type";

export class Interpreter<T = string> {
  private logger: Logger;

  private structure: any;

  private fileLoader: FileLoader;

  private _defaultLanguage: string;

  constructor(config: Config) {
    this.logger = new Logger("Interpreter");

    const { localesPath, defaultLanguage } = config;

    // Verify the locales path
    if (!existsSync(resolve(localesPath))) {
      throw new Exception(`Locales path not found: path "${localesPath}"`);
    }

    // Generate a JSON Types
    FileLoader.generateTypes(localesPath);

    this.fileLoader = FileLoader.init(localesPath);
    this.structure = this.fileLoader.structure;

    // Sets the default language if not provided
    if (!!defaultLanguage) this.defaultLanguage = defaultLanguage;
  }

  get defaultLanguage() {
    return this._defaultLanguage;
  }

  setDefaultLanguage(value: string) {
    this.defaultLanguage = value;
  }

  private set defaultLanguage(value: string) {
    const filePath = this.fileLoader.structure[value];

    if (!filePath || !existsSync(filePath)) {
      throw new Exception(`Language file "${value}" not found`);
    }

    this._defaultLanguage = value;
  }

  translate(code: InterpreterCodeKeys<T>, options: any = {}): string | null {
    if (!code) throw new Exception("The code from message is missing");

    const { lang, args } = options;
    if (!!lang && this._defaultLanguage !== lang) this._defaultLanguage = lang;

    const file = this.fileLoader.readFile(this._defaultLanguage);

    let currPath = file;
    const keys = code?.split(".");
    for (const key of keys) {
      if (currPath[key]) {
        currPath = currPath[key];
      } else {
        throw new Exception(`Key not found: ${code}`);
      }
    }

    // Mensagem original (pode ter placeholders como {{field}})
    let message: string = currPath;

    if (message.includes("{{") && message.includes("}}") && !args) {
      throw new Exception(
        `Arguments are needed for the desired message: ${code}`,
      );
    }

    // Realiza a substituição dos placeholders (ex: {{field}})
    if (args) {
      if (Array.isArray(args)) {
        args.forEach((arg) => {
          if (typeof arg === "object") {
            Object.entries(arg).forEach(([key, value]) => {
              const placeholder = `{{${key}}}`;
              message = message.replace(
                new RegExp(placeholder, "g"),
                String(value),
              );
            });
          }
        });
      } else if (typeof args === "object") {
        Object.entries(args).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`;
          message = message.replace(
            new RegExp(placeholder, "g"),
            String(value),
          );
        });
      }
    }

    return message;
  }
}
