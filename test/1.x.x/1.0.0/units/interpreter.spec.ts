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
});
