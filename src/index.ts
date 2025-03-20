import { resolve } from "path";
import { existsSync } from "fs";
import { Exception } from "./helper/exception";
import { FileLoader } from "./files/file-loader";
import { Config } from "./interfaces/config.interface";
import { TranslateOptions } from "./types/translate-options.type";
import { InterpreterCodeKeys } from "./types/interpreter-translate-keys.type";

export { TranslateOptions } from "./types/translate-options.type";
export { InterpreterCodeKeys } from "./types/interpreter-translate-keys.type";

export class Interpreter<T = string> {
  private fileLoader: FileLoader;
  private _defaultLanguage: string;

  /**
   * Creates an instance of Interpreter.
   * Initializes the file loader and sets the default language.
   *
   * @param {Config} config - Configuration object containing localesPath and defaultLanguage.
   * @throws {Exception} If the locales path is not found.
   */
  constructor(config: Config) {
    const { localesPath, defaultLanguage, exportTypeDeclaration = false } = config;

    // Verify that the locales path exists
    if (!existsSync(resolve(localesPath))) {
      throw new Exception(`Locales path not found: path "${localesPath}"`);
    }

    // Generate TypeScript types based on JSON files in the locales path
    FileLoader.generateTypes(localesPath, exportTypeDeclaration);

    // Initialize the file loader with the provided locales path
    this.fileLoader = FileLoader.init(localesPath);

    // Set the default language if it is provided
    if (!!defaultLanguage) this.defaultLanguage = defaultLanguage;
  }

  /**
   * Gets the default language.
   * @returns {string} The current default language.
   */
  get defaultLanguage(): string {
    return this._defaultLanguage;
  }

  /**
   * Sets the default language.
   * @param {string} value - The new default language.
   */
  setDefaultLanguage(value: string) {
    this.defaultLanguage = value;
  }

  /**
   * Sets the default language and validates its existence.
   *
   * @private
   * @param {string} value - The new default language.
   * @throws {Exception} If the language file is not found.
   */
  private set defaultLanguage(value: string) {
    this.fileLoader.validateStructureFiles(value);
    this._defaultLanguage = value;
  }

  /**
   * Translates a key into the corresponding message.
   *
   * @param {InterpreterCodeKeys<T>} key - The key representing the message.
   * @param {TranslateOptions} [options={}] - Optional parameters including language and arguments.
   * @returns {string | null} The translated message or null if not found.
   * @throws {Exception} If the key is missing or translation fails.
   */
  translate(
    key: InterpreterCodeKeys<T>,
    options: TranslateOptions = {},
  ): string | null {
    // Ensure the key is provided
    if (!key) throw new Exception("The key from message is missing");

    const { lang, args } = options;
    const language = lang || this.defaultLanguage;

    let file: string;
    try {
      // Validate that the language file exists
      this.fileLoader.validateStructureFiles(language);

      // Read the content of the language file
      file = this.fileLoader.readFile(language);
    } catch (e) {
      // If you tried to read it with the default value, it will throw the error
      if (language === this.defaultLanguage) throw e;

      // Try reading the file with the default language
      file = this.fileLoader.readFile(this.defaultLanguage);
    }

    /**
     * Navigate through the file structure using the key (e.g., 'error.network')
     */
    let currPath = file;
    const keys = key.split(".");
    for (const key of keys) {
      if (currPath[key]) {
        currPath = currPath[key];
      } else {
        throw new Exception(`Key not found: ${key}`);
      }
    }

    // The original message, which may contain placeholders like {{field}}
    let message: string = currPath;

    // If the message contains placeholders but no arguments are provided, throw an error
    if (message.includes("{{") && message.includes("}}") && !args) {
      throw new Exception(
        `Arguments are needed for the desired message: ${key}`,
      );
    }

    // Replace placeholders (e.g., {{field}}) with actual values from args
    if (args) {
      if (Array.isArray(args)) {
        args.forEach((arg) => {
          if (typeof arg === "object") {
            /**
             * Replace each placeholder with the corresponding value
             */
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

    // Return the final translated message
    return message;
  }
}
