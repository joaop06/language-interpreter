import { Interpreter } from "../../../../src";
import { it, expect, describe, beforeAll } from "vitest";
import { LanguageNamesTypes, LanguagesTypes } from "./locales/types";
import { Config } from "../../../../src/interfaces/config.interface";

describe("Interpreter instance", () => {
  let config: Config;

  beforeAll(() => {
    config = {
      localesPath: __dirname + "/locales",
    };
  });

  it("should be return a Interpreter", () => {
    const interpreter = new Interpreter(config);
    expect(interpreter).toBeInstanceOf(Interpreter);
  });

  it('should return a error by not found the locales path', () => {
    expect(() => {
      new Interpreter({
        localesPath: __dirname + 'locales2',
      })
    }).toThrow();
  });

  it("must be undefined because it does not provide the default value", () => {
    const interpreter = new Interpreter(config);
    expect(interpreter.defaultLanguage).toBeUndefined();
  });

  it("should be set a different language", () => {
    const interpreter = new Interpreter(config);

    interpreter.setDefaultLanguage("es");
    expect(interpreter.defaultLanguage).toEqual<LanguageNamesTypes>("es");
    expect(interpreter.defaultLanguage).not.toEqual<LanguageNamesTypes>(
      "pt-br",
    );
  });

  it("should return an error when trying set a non existent language", () => {
    const interpreter = new Interpreter(config);
    expect(() => interpreter.setDefaultLanguage("non-existent")).toThrow();

    try {
      interpreter.setDefaultLanguage("non-existent");
    } catch (error: any) {
      const { message } = error;
      expect(message).toContain(`Language file "non-existent" not found`);
    }
  });

  it("should return an error when trying translate a message without code", () => {
    const interpreter = new Interpreter(config);
    expect(() => interpreter.translate("")).toThrow();

    try {
      interpreter.translate("");
    } catch (error: any) {
      const { message } = error;
      expect(message).toContain(`The code from message is missing`);
    }
  });

  it("not found key", () => {
    const interpreter = new Interpreter({
      ...config,
      defaultLanguage: 'a'
    });

    const translate = () => interpreter.translate('key1');

    expect(translate).toThrow();

    try {
      translate();
    } catch (error: any) {
      const { message } = error;
      expect(message).toContain(`Key not found: key1`);
    }
  });

  it("message needs argument, but is not given", () => {
    const interpreter = new Interpreter<LanguagesTypes>({
      ...config,
      defaultLanguage: 'en'
    });

    const translate = () => interpreter.translate('ERRORS.VALIDATION.REQUIRED');

    expect(translate).toThrow();

    try {
      translate();
    } catch (error: any) {
      const { message } = error;
      expect(message).toContain(`Arguments are needed for the desired message: ERRORS.VALIDATION.REQUIRED`);
    }
  });

  it('must be able to translate a message with an argument', () => {
    const interpreter = new Interpreter<LanguagesTypes>({
      ...config,
      defaultLanguage: 'a'
    });

    expect(
      interpreter.translate('ARGS.ONE', { args: { test: 'test' } })
    ).toBe('This message test required a argument');
  });

  it('should be able translate a message with two arguments using object args', () => {
    const interpreter = new Interpreter<LanguagesTypes>({
      ...config,
      defaultLanguage: 'a'
    });

    expect(
      interpreter.translate('ARGS.TWO', { args: { test: 'test', test2: 'test2' } })
    ).toBe('This message test required two arguments, test2');
  });

  it('should be able translate a message with two arguments using array args', () => {
    const interpreter = new Interpreter<LanguagesTypes>({
      ...config,
      defaultLanguage: 'a'
    });

    expect(
      interpreter.translate('ARGS.TWO', { args: [{ test: 'test' }, { test2: 'test2' }] })
    ).toBe('This message test required two arguments, test2');
  });

  it('it must be possible to translate into the desired language', () => {
    const interpreter = new Interpreter<LanguagesTypes>({
      ...config,
      defaultLanguage: 'en'
    });

    expect(
      interpreter.translate('HELLO', { lang: 'es' })
    ).toBe('Hola!!!');
    expect(interpreter.defaultLanguage).toBe<LanguageNamesTypes>('en');
  });

  it(`it shouldn't be possible to translate because the desired language doesn't exist`, () => {
    const interpreter = new Interpreter<LanguagesTypes>({
      ...config,
      defaultLanguage: 'en'
    });

    expect(
      () => interpreter.translate('HELLO', { lang: 'french' })
    ).toThrow();

    try {
      interpreter.translate('HELLO', { lang: 'french' });
    } catch (e: any) {
      const error = e.message;
      expect(error).toContain(`Language file "french" not found`);
    }
  });
});
