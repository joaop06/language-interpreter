import { Locales } from "./types/locales";
import { LanguagesEnum, LanguagesType } from "./types/languages";


export class Interpreter {
    private _language: LanguagesType = LanguagesEnum.EN;

    constructor(
        private locales: Locales,
    ) { }

    get language(): LanguagesType {
        return this._language;
    }
    set language(language: LanguagesType) {
        this._language = language;
    }
}