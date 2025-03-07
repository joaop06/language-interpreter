import { Interpreter } from "../../../../src";
import { JsonFilesType } from "./locales/types";
import { it, expect, describe, beforeAll } from "vitest";
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

  it("should be define language property with default value", () => {
    const interpreter = new Interpreter(config);
    expect(interpreter.defaultLanguage).toEqual<JsonFilesType>("en");
    expect(interpreter.defaultLanguage).not.toEqual<JsonFilesType>("pt-br");
  });

  it("should be set a different language", () => {
    const interpreter = new Interpreter(config);

    interpreter.defaultLanguage = "es";
    expect(interpreter.defaultLanguage).toEqual<JsonFilesType>("es");
    expect(interpreter.defaultLanguage).not.toEqual<JsonFilesType>("pt-br");
  });
});
