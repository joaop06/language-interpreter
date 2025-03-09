import { resolve } from "path";
import { existsSync } from "fs";
import { Logger } from "./helper/logger";
import { Exception } from "./helper/exception";
import { FileLoader } from "./files/file-loader";
import { Config } from "./interfaces/config.interface";
import { InterpreterCodeKeys } from "./types/interpreter-code-keys.type";
import { TranslateOptions } from "types/translate-options.type";

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
    this.validateStructureFiles(value);
    this._defaultLanguage = value;
  }

  private validateStructureFiles(language: string): void {
    const filePath = this.fileLoader.structure[language];

    if (!filePath || !existsSync(filePath)) {
      throw new Exception(`Language file "${language}" not found`);
    }
  }

  translate(code: InterpreterCodeKeys<T>, options: TranslateOptions = {}): string | null {
    if (!code) throw new Exception("The code from message is missing");

    const { lang, args } = options;
    const language = lang || this.defaultLanguage;

    this.validateStructureFiles(language);

    const file = this.fileLoader.readFile(language);

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
