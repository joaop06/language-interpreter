import * as path from "path";
import { FileLoader } from "../src/files/file-loader";
import { describe, expect, it, vi, afterEach } from "vitest";

describe("FileLoader", () => {
  const locales = path.resolve(__dirname, "locales");

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a FileLoader instance using init method", () => {
    const fileLoader = FileLoader.init(locales);
    expect(fileLoader).toBeInstanceOf(FileLoader);
  });

  it("should create a file structure correctly", () => {
    const fileLoader = FileLoader.init(locales);
    expect(fileLoader.structure["en"]).toBeDefined();
    expect(fileLoader.structure["pt-br"]).toBeDefined();
    expect(fileLoader.structure["subdir"]).toBeUndefined();
  });

  it("should throw an error when initializing with a non-existing directory", () => {
    expect(() => FileLoader.init("./test-locales")).toThrow();
  });

  it("should read a JSON file successfully", () => {
    const fileLoader = FileLoader.init(locales);
    const file = fileLoader.readFile("pt-br");
    expect(file).toBeDefined();
  });

  it("should throw an exception when trying to read a non-existent file", () => {
    const fileLoader = FileLoader.init(locales);
    expect(() => fileLoader.readFile("invalid-file")).toThrow();
  });

  it.skip("should read a nested JSON file successfully", () => {
    const fileLoader = FileLoader.init(locales);
    const file = fileLoader.readFile("subdir.nested");
    expect(file).toBeDefined();
  });

  it("should return null when trying to resolve an invalid path", () => {
    const fileLoader = FileLoader.init(locales);
    expect(
      fileLoader["resolvePath"]("invalid.file", fileLoader.structure),
    ).toBeNull();
  });
});
