import { Interpreter } from '../../src/interpreter';
import { it, expect, describe, beforeAll } from 'vitest';
import { Config } from 'src/interfaces/config.interface';
import { LanguagesEnum } from '../../src/types/languages.type';

describe('Interpreter instance', () => {

    let config: Config;

    beforeAll(() => {
        config = {
            basePath: __dirname + '/locales',
        };
    })

    it('should be return a Interpreter', () => {
        const interpreter = new Interpreter(config);
        expect(interpreter).toBeInstanceOf(Interpreter);
    });

    it('should be define language property with default value', () => {
        const interpreter = new Interpreter(config);
        expect(interpreter.language).toEqual(LanguagesEnum.EN);
        expect(interpreter.language).not.toEqual(LanguagesEnum.PT_BR);
    });

    it('should be set a different language', () => {
        const interpreter = new Interpreter(config);

        interpreter.language = LanguagesEnum.ES;
        expect(interpreter.language).toEqual(LanguagesEnum.ES);
        expect(interpreter.language).not.toEqual(LanguagesEnum.PT_BR);
    });
});
