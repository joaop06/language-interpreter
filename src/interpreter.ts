import { Logger } from "../helper/logger";
import { Exception } from "../helper/exception";
import { Config } from "./interfaces/config.interface";
import { InterpreterProps } from "./interpreter-props";

export * from "./files/generate-json-types";
export class Interpreter<T = never> {
    private logger: Logger;

    private props: InterpreterProps<T>;

    constructor(
        private config: Config,
    ) {
        this.logger = new Logger('Interpreter');
        this.props = new InterpreterProps<T>(this.config);

        this.checkType();
    }

    private checkType() {
        if (this.isTypeMissing()) {
            new Exception('Type T was not specified in the Interpreter instance');
        }
    }

    private isTypeMissing(): boolean {
        return false as T extends never ? true : false;
    }


    get language(): typeof this.props.languages {
        return this.props.language;
    }
    set language(value: typeof this.props.languages) {
        this.props.language = value;
    }

    translate(code: string, options: any = {}): string | null {
        if (!code) new Exception('The code from message is missing');

        const { lang, args } = options;
        if (!!lang && this.language !== lang) this.language = lang;

        const file = this.props.fileLoader.readFile(this.language);

        let currPath = file;
        const keys = code?.split('.');
        for (const key of keys) {
            if (currPath[key]) {
                currPath = currPath[key];

            } else {
                new Exception(`Key not found: ${code}`);
            }
        }

        // Mensagem original (pode ter placeholders como {{field}})
        let message: string = currPath;

        if (typeof message !== 'string') {
            new Exception(`Message path is not a string: ${code}`);
        }

        if (message.includes('{{') && message.includes('}}') && !args) {
            new Exception(`Arguments are needed for the desired message: ${code}`);
        }

        // Realiza a substituição dos placeholders (ex: {{field}})
        if (args) {
            if (Array.isArray(args)) {
                args.forEach((arg) => {
                    if (typeof arg === 'object') {
                        Object.entries(arg).forEach(([key, value]) => {
                            const placeholder = `{{${key}}}`;
                            message = message.replace(
                                new RegExp(placeholder, 'g'),
                                String(value),
                            );
                        });
                    }
                });
            } else if (typeof args === 'object') {
                Object.entries(args).forEach(([key, value]) => {
                    const placeholder = `{{${key}}}`;
                    message = message.replace(new RegExp(placeholder, 'g'), String(value));
                });
            }
        }

        return message;
    };
}
