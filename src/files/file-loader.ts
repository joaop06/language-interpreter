import {
  mkdirSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join, resolve } from "path";
import { Exception } from "../helper/exception";

export type FileStructureType = {
  [key: string]: FileStructureType | string;
};

export class FileLoader<T = any> {
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

  public validateStructureFiles(language: string): void {
    const filePath = this.structure[language];

    if (!filePath || !existsSync(resolve(filePath))) {
      throw new Exception(`Language file "${language}" not found`);
    }
  }

  /**
   * Resolve the path to a file within the file structure.
   *
   * @param {string} fileName - The name of the file to resolve.
   * @param {any} structure - The file structure object.
   * @returns {string | null} - The resolved file path or null if not found.
   */
  private resolvePath(fileName: string, structure: any): string | null {
    let current = structure;
    const parts = fileName.split(".");

    for (const part of parts) {
      if (!current[part]) return null;
      current = current[part];
    }

    return current;
  }

  /**
   * Create the file structure using a
   * recursive function to create a file structure at any level
   *
   * @param {string} dir - The base directory to start scanning.
   * @returns {FileStructureType} - The generated file structure object.
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
   * Generates TypeScript type definitions based on the JSON file structure.
   *
   * @param {string} baseDir - The base directory containing the JSON files.
   */
  static generateTypes(baseDir: string, exportTypeDeclaration: boolean = false) {
    // List of file names used to generate type imports/exports
    const fileNames = [];

    // Create a "types" folder inside baseDir
    const typesDir = resolve(join(baseDir, "types"));
    if (!existsSync(typesDir)) {
      mkdirSync(typesDir);
    }

    // Recursive function to generate types for each JSON file
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

            // Format the file name to TitleCase
            const nameTitle = this.formatJsonName(name);

            // Convert the JSON structure to TypeScript type definition
            const content = this.generateTypeDefinationJSON(readFile);

            // Generate type definition file
            const extFile = !!exportTypeDeclaration ? "d.ts" : "ts";
            const typeFilePath = join(typesDir, `${name}.${extFile}`);
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

    // Generate the index.d.ts file to export all types
    this.generateIndexFile(typesDir, fileNames, exportTypeDeclaration);
  }

  /**
   * Formats the JSON file name into a valid TypeScript type name.
   *
   * @param {string} str - The file name to format.
   * @param {boolean} [upperCase=true] - Whether to capitalize the first letter.
   * @returns {string} - The formatted name.
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
   * Converts a JSON object into a TypeScript type definition.
   *
   * @param {any} object - The JSON object to convert.
   * @param {number} [indent=2] - The indentation level.
   * @returns {string} - The generated TypeScript type definition.
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

  /**
   * Generates an index file to export all types.
   *
   * @param {string} typesDir - The directory containing the type files.
   * @param {string[]} fileNames - The list of generated file names.
   */
  private static generateIndexFile(typesDir: string, fileNames: string[], exportTypeDeclaration: boolean) {
    // Generate imports and exports for each type definition

    const imports = fileNames
      .map(
        (name) =>
          `import ${this.formatJsonName(name, false)} from './${name}';
export * as ${this.formatJsonName(name, false)} from './${name}';\n`,
      )
      .join("\n");

    const namesToLanguageNamesTypes =
      fileNames.map((name) => `"${name}"`).join(" | ") || "any";
    const namesToLanguagesTypes =
      fileNames.map((name) => this.formatJsonName(name, false)).join(" | ") ||
      "any";
    const namesToLanguagesEnum =
      fileNames.map((name) => `\n    ${this.formatJsonName(name).toUpperCase()} = "${name}"`)

    const jsonTypes = `${imports}\n
/**\n * Type to group the types of JSON files\n */
export type LanguagesTypes = ${namesToLanguagesTypes};\n
/**\n * Types to represent the names of JSON files\n */
export type LanguageNamesTypes = ${namesToLanguageNamesTypes};\n
/**\n * Enum to represent the names of JSON files\n */
export enum LanguagesEnum {${namesToLanguagesEnum},\n};\n`;

    // Save "index" file
    const extFile = !!exportTypeDeclaration ? "d.ts" : "ts";
    writeFileSync(join(typesDir, `index.${extFile}`), jsonTypes, "utf-8");
  }
}
