import { join } from "path";
import { FileLoader } from "../src/files/file-loader";
import { it, expect, describe, afterEach, beforeEach } from "vitest";
import { rmSync, mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";

describe("generateTypes", () => {
  const testDir = join(__dirname, "test-locales");

  let timeSleep = 10;
  const sleep = async () =>
    await new Promise((resolve) => setTimeout(resolve, (timeSleep += 10)));

  beforeEach(() => {
    // Cria um diretório de teste antes de cada teste
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Remove o diretório de teste após cada teste
    rmSync(testDir, { recursive: true, force: true });
  });

  it("must create the types based on the JSON files", async () => {
    await sleep();

    // Cria alguns arquivos JSON no diretório de teste
    writeFileSync(
      join(testDir, "example1.json"),
      JSON.stringify({ key1: "value1", key2: "value2" }),
    );
    writeFileSync(
      join(testDir, "example2.json"),
      JSON.stringify({ nested: { key: "value" } }),
    );

    FileLoader.generateTypes(testDir);

    // Verifica se o arquivo de tipos foi criado
    const typeFilePath = join(testDir, "json-structures.type.d.ts");
    expect(existsSync(typeFilePath)).toBe(true);

    // Verifica o conteúdo do arquivo de tipos
    const typeFileContent = readFileSync(typeFilePath, "utf-8");
    expect(typeFileContent).toContain("export type Example1 = {");
    expect(typeFileContent).toContain("export type Example2 = {");
    expect(typeFileContent).toContain("key1: string;");
    expect(typeFileContent).toContain("nested: {");
  });

  it("must handle directories with subdirectories correctly", async () => {
    await sleep();

    // Cria uma estrutura de diretórios com subdiretórios e arquivos JSON
    mkdirSync(join(testDir, "subdir"));
    writeFileSync(
      join(testDir, "subdir", "example3.json"),
      JSON.stringify({ key3: "value3" }),
    );

    FileLoader.generateTypes(testDir);

    // Verifica se o arquivo de tipos foi criado e contém os tipos corretos
    const typeFilePath = join(testDir, "json-structures.type.d.ts");
    expect(existsSync(typeFilePath)).toBe(true);

    const typeFileContent = readFileSync(typeFilePath, "utf-8");
    expect(typeFileContent).toContain("export type Example3 = {");
    expect(typeFileContent).toContain("key3: string;");
  });

  it("must throw an exception when the directory does not exist", () => {
    const nonExistentDir = join(testDir, "non-existent");

    expect(() => FileLoader.generateTypes(nonExistentDir)).toThrow();
  });

  it("must handle invalid JSON files correctly", () => {
    // Cria um arquivo JSON malformado
    writeFileSync(join(testDir, "invalid.json"), '{"key": "value"');

    expect(() => FileLoader.generateTypes(testDir)).toThrow();
  });

  it("must handle empty directories correctly", async () => {
    await sleep();

    FileLoader.generateTypes(testDir);

    // Verifica se o arquivo de tipos foi criado, mesmo que o diretório esteja vazio
    const typeFilePath = join(testDir, "json-structures.type.d.ts");
    expect(existsSync(typeFilePath)).toBe(true);

    // Verifica se o arquivo de tipos está vazio (apenas com a estrutura básica)
    const typeFileContent = readFileSync(typeFilePath, "utf-8");
    expect(typeFileContent).toContain("export type JsonTypes = any;");
    expect(typeFileContent).toContain("export type JsonFilesType = any;");
  });
});
