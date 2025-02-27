import * as path from "path";
import { FileLoader } from "../src/files/file-loader";
import { it, expect, describe, vi, afterEach } from "vitest";

describe("FileStructure", () => {
  const locales = path.resolve(__dirname, "locales");

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be return a file structure by createFileStructure method", () => {
    const structure = FileLoader.createFileStructure(locales);

    expect(structure["en"]).toBeDefined();
    expect(structure["es"]).toBeDefined();
    expect(structure["pt-br"]).toBeDefined();
  });

  it("an error should be triggered for not finding the directory", () => {
    expect(() => FileLoader.createFileStructure("./test-locales")).toThrow();
  });

  it("should not be able return the text file", () => {
    const structure = FileLoader.createFileStructure(locales);

    expect(structure["en"]).toBeDefined();
    expect(structure["text"]).not.toBeDefined();
  });

  it("should return a file structure by createFileStructure method", () => {
    const structure = FileLoader.createFileStructure(locales);

    expect(structure["en"]).toBeDefined();
    expect(structure["es"]).toBeDefined();
    expect(structure["pt-br"]).toBeDefined();
  });

  it("should trigger an error when directory is not found", () => {
    expect(() => FileLoader.createFileStructure("./test-locales")).toThrow();
  });

  it("should not include non-JSON files in the structure", () => {
    const structure = FileLoader.createFileStructure(locales);

    expect(structure["en"]).toBeDefined();
    expect(structure["text"]).not.toBeDefined(); // Garantindo que text.txt não seja incluído
  });
});
