import { Logger } from "../helper/logger";
import { FileLoader } from "./files/file-loader";
import { Config } from "./interfaces/config.interface";
import { FileStructureType } from "./files/file-structure";

export class InterpreterProps {
    private logger: Logger;

    structure: any;

    outDirTypeDefinitionFiles: string;

    fileLoader: FileLoader<FileStructureType>;

    _languages: any;
    _language: typeof this._languages;

    constructor(
        path: string,
        private config: Config,
    ) {
        const { defaultLanguage = 'en', outDirTypeDefinitionFiles } = this.config;

        this._language = defaultLanguage;
        this.outDirTypeDefinitionFiles = outDirTypeDefinitionFiles;


        this.fileLoader = FileLoader.init(path, outDirTypeDefinitionFiles);
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
