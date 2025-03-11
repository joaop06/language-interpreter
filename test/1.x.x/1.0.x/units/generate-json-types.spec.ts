import { join } from "path";
import { FileLoader } from "../../../../src/files/file-loader";
import { it, expect, describe, afterEach, beforeEach } from "vitest";
import { rmSync, mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";

describe("generateTypes", () => {
  const testDir = join(__dirname, "test-locales");

  let timeSleep = 10;
  const sleep = async () =>
    await new Promise((resolve) => setTimeout(resolve, (timeSleep += 10)));

  beforeEach(() => {
    // Create a test directory before each test
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Removes the test directory after each test
    rmSync(testDir, { recursive: true, force: true });
  });

  it("must create the types based on the JSON files", async () => {
    await sleep();

    // Create some JSON files in the test directory
    writeFileSync(
      join(testDir, "example1.json"),
      JSON.stringify({ key1: "value1", key2: "value2" }),
    );
    writeFileSync(
      join(testDir, "example2.json"),
      JSON.stringify({ nested: { key: "value" } }),
    );

    FileLoader.generateTypes(testDir);

    // Checks that the type file has been created
    const typeIndexFilePath = join(testDir, "types");
    expect(existsSync(typeIndexFilePath)).toBe(true);

    /**
     * Checks the contents of the type file
     *
     * Example file 1
     */
    const typeExample1FilePath = join(testDir, "types", "example1.d.ts");
    const typeExample1FileContent = readFileSync(typeExample1FilePath, "utf-8");

    expect(typeExample1FileContent).toContain("key1: string;");
    expect(typeExample1FileContent).toContain("export default Example1;");

    /**
     * Example file 2
     */
    const typeExample2FilePath = join(testDir, "types", "example2.d.ts");
    const typeExample2FileContent = readFileSync(typeExample2FilePath, "utf-8");

    expect(typeExample2FileContent).toContain("nested: {");
    expect(typeExample2FileContent).toContain("export default Example2;");
  });

  it("must handle directories with subdirectories correctly", async () => {
    await sleep();

    // Creates a directory structure with subdirectories and JSON files
    mkdirSync(join(testDir, "subdir"));
    writeFileSync(
      join(testDir, "subdir", "example3.json"),
      JSON.stringify({ key3: "value3" }),
    );

    FileLoader.generateTypes(testDir);

    // Checks that the type file has been created and contains the correct types
    const typeIndexFilePath = join(testDir, "types", "index.d.ts");
    expect(existsSync(typeIndexFilePath)).toBe(true);

    const typeFilePath = join(testDir, "types", "example3.d.ts");

    const typeFileContent = readFileSync(typeFilePath, "utf-8");
    expect(typeFileContent).toContain("export default Example3;");
    expect(typeFileContent).toContain("key3: string;");
  });

  it("must throw an exception when the directory does not exist", () => {
    const nonExistentDir = join(testDir, "non-existent");

    expect(() => FileLoader.generateTypes(nonExistentDir)).toThrow();
  });

  it("must handle invalid JSON files correctly", () => {
    // Creates a malformed JSON file
    writeFileSync(join(testDir, "invalid.json"), '{"key": "value"');

    expect(() => FileLoader.generateTypes(testDir)).toThrow();
  });

  it("must handle empty directories correctly", async () => {
    await sleep();

    FileLoader.generateTypes(testDir);

    // Checks that the type file has been created, even if the directory is empty
    const typeIndexFilePath = join(testDir, "types", "index.d.ts");
    expect(existsSync(typeIndexFilePath)).toBe(true);

    // Checks if the type file is empty (only with the basic structure)
    const typeFileContent = readFileSync(typeIndexFilePath, "utf-8");
    expect(typeFileContent).toContain("export type LanguagesTypes = any;");
    expect(typeFileContent).toContain("export type LanguageNamesTypes = any;");
  });
});
