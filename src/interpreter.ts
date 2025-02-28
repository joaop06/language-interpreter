import { Exception } from "../helper/exception";
import { Config } from "./interfaces/config.interface";
import { InterpreterProps } from "./interpreter-props";
import { InterpreterCodeKeys } from "./types/interpreter-code-keys.type";

export class Interpreter<T = string> extends InterpreterProps {
  constructor(config: Config) {
    super(config);
  }

  get language(): typeof this.languages {
    return super.language;
  }
  set language(value: typeof this.languages) {
    super.language = value;
  }

  translate(code: InterpreterCodeKeys<T>, options: any = {}): string | null {
    if (!code) throw new Exception("The code from message is missing");

    const { lang, args } = options;
    if (!!lang && this.language !== lang) this.language = lang;

    const file = this.fileLoader.readFile(this.language);

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

    if (typeof message !== "string") {
      throw new Exception(`Message path is not a string: ${code}`);
    }

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
