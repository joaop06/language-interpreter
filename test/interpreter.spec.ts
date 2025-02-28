import { Interpreter } from "../src/interpreter";
import { it, expect, describe, beforeAll } from "vitest";
import { Config } from "../src/interfaces/config.interface";
import { JsonFilesType } from "./locales/json-structures.type";

describe("Interpreter instance", () => {
  let config: Config;

  beforeAll(() => {
    config = {
      basePath: __dirname + "/locales",
    };
  });

  it("should be return a Interpreter", () => {
    const interpreter = new Interpreter(config);
    expect(interpreter).toBeInstanceOf(Interpreter);
  });

  it("should be define language property with default value", () => {
    const interpreter = new Interpreter(config);
    expect(interpreter.language).toEqual<JsonFilesType>("en");
    expect(interpreter.language).not.toEqual<JsonFilesType>("pt-br");
  });

  it("should be set a different language", () => {
    const interpreter = new Interpreter(config);

    interpreter.language = "es";
    expect(interpreter.language).toEqual<JsonFilesType>("es");
    expect(interpreter.language).not.toEqual<JsonFilesType>("pt-br");
  });
});
