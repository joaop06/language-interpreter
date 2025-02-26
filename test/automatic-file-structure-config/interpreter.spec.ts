import { Interpreter } from '../../src/interpreter';
import { it, expect, describe, beforeAll } from 'vitest';
import { Config } from '../../src/interfaces/config.interface';
import { JsonTypes, JsonFilesEnum } from './locales/json-types';

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
        const interpreter = new Interpreter<JsonTypes>(config);
        expect(interpreter.language).toEqual(JsonFilesEnum.EN);
        expect(interpreter.language).not.toEqual(JsonFilesEnum.PT_BR);
    });

    it('should be set a different language', () => {
        const interpreter = new Interpreter<JsonTypes>(config);

        interpreter.language = JsonFilesEnum.ES;
        expect(interpreter.language).toEqual(JsonFilesEnum.ES);
        expect(interpreter.language).not.toEqual(JsonFilesEnum.PT_BR);
    });
});
