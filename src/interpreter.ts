import { Logger } from "../helper/logger";
import { Exception } from "../helper/exception";
import { Config } from "./interfaces/config.interface";
import { InterpreterProps } from "./interpreter-props";

export class Interpreter {
    private logger: Logger;

    private props: InterpreterProps;

    constructor(
        private config: Config,
    ) {
        const { basePath } = this.config;
        this.logger = new Logger('Interpreter');
        this.props = new InterpreterProps(basePath, this.config);
    }

    get language(): typeof this.props.languages {
        return this.props.language;
    }
    set language(value: typeof this.props.languages) {
        this.props.language = value;
    }

    translate(code: string, options: any = {}): string | null {
        if (!code) new Exception('The code from message is missing');

        const keys = code?.split('.');
        const { lang, args } = options;

        const file = require(`./languages/${lang}.json`);

        let currPath = file;

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
            // const errorMessage = await this.translate(
            //   'ERRORS.COMMON.INVALID_TRANSLATE_CODE',
            //   { lang },
            // );

            new Exception(`${'errorMessage'}: ${code}`);
        }

        if (message.includes('{{') && message.includes('}}') && !args) {
            // const errorMessage = await this.translate('ERRORS.COMMON.BAD_REQUEST', { lang });

            new Exception(`${'errorMessage'}: ${code}`);
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
