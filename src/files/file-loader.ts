import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join, resolve } from "path";
import { Exception } from "../helper/exception";

export type FileStructureType = {
  [key: string]: FileStructureType | string;
};

export class FileLoader<T extends FileStructureType = any> {
  constructor(
    public basePath: string,
    public structure: T,
  ) {
    this.basePath = resolve(basePath);
  }

  static init(basePath: string): FileLoader<any> {
    const structure = this.createFileStructure(basePath);
    return new FileLoader<typeof structure>(basePath, structure);
  }

  public readFile(fileName: string): string {
    const fullPath = this.resolvePath(fileName, this.structure);

    if (!fullPath) throw new Exception(`File not found: ${fileName}`);

    // eslint-disable-next-line
    return require(resolve(fullPath));
  }

  private resolvePath(fileName: string, structure: any): string | null {
    let current = structure;
    const parts = fileName.split(".");

    for (const part of parts) {
      if (!current[part]) return null;
      current = current[part];
    }

    return typeof current === "string" ? current : null;
  }

  /**
   * Create the file structure using a
   * recursive function to create a file structure at any level
   *
   * @param {string} dir
   * @returns {FileStructureType}
   */
  static createFileStructure(dir: string): FileStructureType {
    // Recursive function to access several levels
    const recursiveFileStructure = (dir: string): FileStructureType => {
      const entries = readdirSync(dir, { withFileTypes: true });

      return entries.reduce<FileStructureType>((acc, entry) => {
        const entryPath = join(dir, entry.name);
        const isDirectory = entry.isDirectory();
        const name = entry.name.replace(".json", "");

        if (isDirectory || entry.name.endsWith(".json")) {
          if (!isDirectory) acc[name] = entryPath;
          else acc[name] = recursiveFileStructure(entryPath);
        }

        return acc;
      }, {});
    };

    return recursiveFileStructure(dir);
  }

  /**
   * Generates a file with the types representing the structures of JSON files
   *
   * @param {string} baseDir
   */
  static generateTypes(baseDir: string) {
    /** Content that will be generated in the file with the types */
    const fileNames = [];

    // Create a "types" folder inside baseDir
    const typesDir = resolve(join(baseDir, "types"));
    if (!existsSync(typesDir)) {
      mkdirSync(typesDir);
    }

    // Recursive function to access several levels
    const recursiveFileStructure = (dir: string): void => {
      const entries = readdirSync(dir, { withFileTypes: true });

      entries.forEach((entry) => {
        const isDirectory = entry.isDirectory();
        const name = entry.name.replace(".json", "");
        const entryPath = resolve(join(dir, entry.name));

        if (isDirectory || entry.name.endsWith(".json")) {
          if (isDirectory) {
            recursiveFileStructure(entryPath);
          } else {
            const readFile = JSON.parse(readFileSync(entryPath, "utf-8"));

            // Format the file name to TitleC ase
            const nameTitle = this.formatJsonName(name);

            // Convert the JSON structure in type
            const content = this.generateTypeDefinationJSON(readFile);
            // typeFilesDefinitionContent += `export type ${nameTitle} = {\n${content}\n};\n`;

            const typeFilePath = join(typesDir, `${name}.d.ts`);
            writeFileSync(
              typeFilePath,
              `type ${nameTitle} = {\n${content}\n};\n\nexport default ${nameTitle};\n`,
              "utf-8",
            );

            fileNames.push(name);
          }
        }
      });
    };

    recursiveFileStructure(baseDir);

    // Gerenate the indes.d.ts file
    this.generateIndexFile(typesDir, fileNames);
  }

  /**
   * formats the name of the JSON file
   * @param str
   * @param upperCase
   * @returns
   */
  private static formatJsonName(str: string, upperCase = true) {
    return str
      .replace(/\b\w/g, (char) =>
        upperCase ? char.toUpperCase() : char.toLowerCase(),
      )
      .replaceAll("-", "_")
      .replaceAll(".", "_");
  }

  /**
   * Function to convert the JSON structure in type
   */
  private static generateTypeDefinationJSON(
    object: any,
    indent: number = 2,
  ): string {
    const entries = Object.entries(object)
      .map(([key, value]) => {
        if (typeof value === "string") {
          return `${" ".repeat(indent)}${key}: string;`;
        } else if (typeof value === "object" && value !== null) {
          const lastIndent = `${" ".repeat(indent)}`;
          const firstIndentAndKey = `${" ".repeat(indent)}${key}`;
          const recursiveKeys = this.generateTypeDefinationJSON(
            value,
            indent + 2,
          );

          return `${firstIndentAndKey}: {\n${recursiveKeys}\n${lastIndent}};`;
        }
      })
      .filter(Boolean);

    return entries.join("\n");
  }

  private static generateIndexFile(
    typesDir: string,
    fileNames: string[],
  ) {
    // Gera o arquivo "json-structures.type.d.ts" com as importações e exportações
    const imports = fileNames
      .map(
        (name) =>
          `import ${this.formatJsonName(name, false)} from './${name}';
export * as ${this.formatJsonName(name, false)} from './${name}';\n`,
      )
      .join("\n");


    const namesToLanguageNamesTypes = fileNames.map((name) => `"${name}"`).join(" | ") || "any";
    const namesToLanguagesTypes = fileNames.map(name => this.formatJsonName(name, false)).join(" | ") || "any";

    const jsonTypes = `${imports}\n
/**\n * Type to group the types of JSON files\n */
export type LanguagesTypes = ${namesToLanguagesTypes};\n
/**\n * Types to represent the names of JSON files\n */
export type LanguageNamesTypes = ${namesToLanguageNamesTypes};`;

    // Save "index.d.ts"
    writeFileSync(join(typesDir, "index.d.ts"), jsonTypes, "utf-8");
  }
}
