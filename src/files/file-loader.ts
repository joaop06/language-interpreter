import { join, resolve } from "path";
import { Exception } from "../../helper/exception";
import { existsSync, readdirSync, writeFileSync } from "fs";

export type FileStructureType = {
  [key: string]: FileStructureType | string;
};

export class FileLoader<T extends FileStructureType> {
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
    const nameTypes = [];
    let typeFilesDefinitionContent: string = "";

    // Recursive function to access several levels
    const recursiveFileStructure = (dir: string): void => {
      const entries = readdirSync(dir, { withFileTypes: true });

      entries.forEach((entry) => {
        const entryPath = join(dir, entry.name);
        const isDirectory = entry.isDirectory();
        const name = entry.name.replace(".json", "");

        if (isDirectory || entry.name.endsWith(".json")) {
          if (isDirectory) recursiveFileStructure(entryPath);
          else {
            // eslint-disable-next-line
            const readFile = require(entryPath);

            if (!existsSync(dir)) {
              throw new Exception(
                `Type definition files directory not found: ${dir}`,
              );
            }

            /**
             * Function to convert the JSON structure in type
             * @param object
             * @param indent
             * @returns
             */
            const generateTypeDefinationJSON = (
              object: any,
              indent: number = 2,
            ): string => {
              const entries = Object.entries(object)
                .map(([key, value]) => {
                  if (typeof value === "string") {
                    return `${" ".repeat(indent)}${key}: string;`;
                  } else if (typeof value === "object" && value !== null) {
                    const lastIndent = `${" ".repeat(indent)}`;
                    const firstIndentAndKey = `${" ".repeat(indent)}${key}`;
                    const recursiveKeys = generateTypeDefinationJSON(
                      value,
                      indent + 2,
                    );

                    return `${firstIndentAndKey}: {\n${recursiveKeys}\n${lastIndent}};`;
                  }
                  return "";
                })
                .filter(Boolean);

              return entries.join("\n");
            };

            // Format the file name to TitleCase
            const toTitleCase = (str: string) =>
              str
                .replace(/\b\w/g, (char) => char.toUpperCase())
                .replaceAll("-", "_")
                .replaceAll(".", "_");
            const nameTitle = toTitleCase(name);

            // Convert the JSON structure in type
            const content = generateTypeDefinationJSON(readFile);
            typeFilesDefinitionContent += `export type ${nameTitle} = {\n${content}\n};\n\n`;

            fileNames.push(name);
            nameTypes.push(nameTitle);
          }
        }
      });
    };

    recursiveFileStructure(baseDir);

    // Presentation of the exported Type and Enum
    let jsonTypes = `/**\n * Types to represent the JSON structures of the files\n */\n`;

    // File exports
    const types = fileNames.map((name) => `'${name.toLowerCase()}'`);
    jsonTypes += `export type JsonTypes = ${nameTypes.join(" | ")};`;
    jsonTypes += `\n\nexport type JsonFilesType = ${types.join(" | ")};`;

    // Presentation of existing types
    jsonTypes += `\n\n\n/**\n * Structures of each JSON file represented in a specific type\n${nameTypes.map((name) => ` * @see ${name}`).join("\n")}\n */\n\n`;

    // Type contents
    jsonTypes += `${typeFilesDefinitionContent}`;

    // Saves the new JsonTypes file
    writeFileSync(join(baseDir, `json-types.d.ts`), jsonTypes, "utf-8");
  }
}
