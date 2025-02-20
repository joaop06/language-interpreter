import { Logger } from "../helper/logger";
import { FileLoader } from "./files/file-loader";
import { Config } from "./interfaces/config.interface";
import { FileStructureType } from "./files/file-structure";

export class InterpreterProps {
    private logger: Logger;

    structure: any;

    fileLoader: FileLoader<FileStructureType>;

    _languages: any;
    _language: typeof this._languages;

    constructor(
        private config: Config,
    ) {
        const {
            basePath: path,
            defaultLanguage = 'en',
        } = this.config;

        this._language = defaultLanguage;


        this.fileLoader = FileLoader.init(path);
        this.structure = this.fileLoader.structure;

        this.logger = new Logger('InterpreterProps');
        this.defineLanguages();
    }

    get languages(): string { return this._languages; }

    get language(): string { return this._language; }
    set language(lang: typeof this._languages) { this._language = lang; }


    defineLanguages() {
        // console.log(this.structure);
    }
}
