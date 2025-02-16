import { Logger } from "./logger";
import { Exception } from "./exception";
import { ArgsType } from "./types/args.type";
import { FileLoader } from "./files/file-loader";
import { LanguagesType } from "./types/languages";
import { Config } from "./interfaces/config.interface";
import { FileStructureType } from "./files/file-structure";

export class InterpreterProps {
    private logger: Logger;

    public structure: any;

    public fileLoader: FileLoader<FileStructureType>;

    public _languages: any;
    public _language: typeof this._languages = 'en';

    constructor(
        public path: string,
        private config: Config,
    ) {
        this.fileLoader = FileLoader.init(path);
        this.structure = this.fileLoader.structure;
        this.logger = new Logger('InterpreterProps');

        this.defineLanguages();
    }

    get languages(): string { return this._languages; }

    get language(): string { return this._language; }
    set language(lang: typeof this._languages) { this._language = lang; }


    defineLanguages() {
        console.log(this.structure);
    }
}

export type TranslateOptionsType<T> = {
    args?: ArgsType<any>,
    lang: LanguagesType,
}