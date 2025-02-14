import { Logger } from "./logger";
import { ArgsType } from "./types/args.type";
import { TypeMessage } from "./types/message.type";
import { Config } from "./interfaces/config.interface";
import { LanguagesEnum, LanguagesType } from "./types/languages";
import { TranslationKeys } from "./types/translation-keys.type";
import { FileLoader } from "./file-loader";

export class Interpreter {
    private logger: Logger;

    private _fileLoader: FileLoader<any>;

    private _language: LanguagesType = LanguagesEnum.EN;

    constructor(
        private options: Config,
    ) {
        this.logger = new Logger('Interpreter');
        this.createDynamicLoader(options.basePath);
    }

    get language(): LanguagesType {
        return this._language;
    }
    set language(language: LanguagesType) {
        this._language = language;
    }

    private createDynamicLoader(basePath: string) {
        const structure = new FileLoader(basePath).getStructure();

        type Structure = typeof structure;
        this._fileLoader = new FileLoader<Structure>(basePath);
    }

    translate(code: string, options: any = {}): string | null {

        if (!code) {
            const error = 'The code from message is missing';

            this.logger.error(error);
            throw new Error(error);
        }

        const keys = code?.split('.');
        const { lang, args } = options;

        const file = require(`./languages/${lang}.json`);

        let currPath = file;

        for (const key of keys) {
            if (currPath[key]) {
                currPath = currPath[key];

            } else {
                throw new Error(`Chave de tradução não encontrada: ${code}`);
            }
        }

        // Mensagem original (pode ter placeholders como {{field}})
        let message: string = currPath;

        if (typeof message !== 'string') {
            // const errorMessage = await this.translate(
            //   'ERRORS.COMMON.INVALID_TRANSLATE_CODE',
            //   { lang },
            // );

            this.logger.error(`${'errorMessage'}: ${code}`);
            throw new Error('errorMessage');
        }

        if (message.includes('{{') && message.includes('}}') && !args) {
            // const errorMessage = await this.translate('ERRORS.COMMON.BAD_REQUEST', { lang });

            this.logger.error(`${'errorMessage'}: ${code}`);
            throw new Error('errorMessage');
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

export type TranslateOptionsType<T> = {
    args?: ArgsType<any>,
    lang: LanguagesType,
}