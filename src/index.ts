import { resolve } from "path";
import { existsSync } from "fs";
import { Logger } from "./helper/logger";
import { Exception } from "./helper/exception";
import { FileLoader } from "./files/file-loader";
import { Config } from "./interfaces/config.interface";
import { TranslateOptions } from "./types/translate-options.type";
import { InterpreterCodeKeys } from "./types/interpreter-translate-keys.type";

export { TranslateOptions } from "./types/translate-options.type";
export { InterpreterCodeKeys } from "./types/interpreter-translate-keys.type";

export class Interpreter<T = string> {
  private logger: Logger;

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
    this.fileLoader.validateStructureFiles(value);
    this._defaultLanguage = value;
  }

  translate(
    key: InterpreterCodeKeys<T>,
    options: TranslateOptions = {},
  ): string | null {
    if (!key) throw new Exception("The key from message is missing");

    const { lang, args } = options;
    const language = lang || this.defaultLanguage;

    let file: string;
    try {
      // Validates that the language file exists
      this.fileLoader.validateStructureFiles(language);

      // Read file language
      file = this.fileLoader.readFile(language);
    } catch (e) {
      // If you tried to read it with the default value, it will throw the error
      if (language === this.defaultLanguage) throw e;

      // Otherwise, it will try again with the default value
      file = this.fileLoader.readFile(this.defaultLanguage);
    }

    let currPath = file;
    const keys = key.split(".");
    for (const key of keys) {
      if (currPath[key]) {
        currPath = currPath[key];
      } else {
        throw new Exception(`Key not found: ${key}`);
      }
    }

    // Mensagem original (pode ter placeholders como {{field}})
    let message: string = currPath;

    if (message.includes("{{") && message.includes("}}") && !args) {
      throw new Exception(
        `Arguments are needed for the desired message: ${key}`,
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
