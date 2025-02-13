import { it, expect } from 'vitest';
import { Interpreter } from '../src/interpreter';
import { LanguagesEnum } from '../src/types/languages';


it('should be return a Interpreter instance', () => {
    const interpreter = new Interpreter('./locales');
    expect(interpreter).toBeInstanceOf(Interpreter);
});

it('should be define language property with default value', () => {
    const interpreter = new Interpreter('./locales');
    expect(interpreter.language).toEqual(LanguagesEnum.EN);
    expect(interpreter.language).not.toEqual(LanguagesEnum.PT_BR);
});

it('should be set a different language', () => {
    const interpreter = new Interpreter('./locales');

    interpreter.language = LanguagesEnum.ES;
    expect(interpreter.language).toEqual(LanguagesEnum.ES);
    expect(interpreter.language).not.toEqual(LanguagesEnum.PT_BR);
});