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
    const nameTypes = [];

    // Create a "types" folder inside baseDir
    const typesDir = join(baseDir, "types");
    if (!existsSync(typesDir)) {
      mkdirSync(typesDir);
    }

    const formatName = (str: string, upperCase = true) =>
      str
        .replace(/\b\w/g, (char) =>
          upperCase ? char.toUpperCase() : char.toLowerCase(),
        )
        .replaceAll("-", "_")
        .replaceAll(".", "_");

    // Recursive function to access several levels
    const recursiveFileStructure = (dir: string): void => {
      const entries = readdirSync(dir, { withFileTypes: true });

      entries.forEach((entry) => {
        const entryPath = join(dir, entry.name);
        const isDirectory = entry.isDirectory();
        const name = entry.name.replace(".json", "");

        if (isDirectory || entry.name.endsWith(".json")) {
          if (isDirectory) {
            recursiveFileStructure(entryPath);
          } else {
            const readFile = JSON.parse(readFileSync(entryPath, "utf-8"));

            /**
             * Function to convert the JSON structure in type
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
                })
                .filter(Boolean);

              return entries.join("\n");
            };

            // Format the file name to TitleCase
            const nameTitle = formatName(name);

            // Convert the JSON structure in type
            const content = generateTypeDefinationJSON(readFile);
            // typeFilesDefinitionContent += `export type ${nameTitle} = {\n${content}\n};\n`;

            const typeFilePath = join(typesDir, `${name}.d.ts`);
            writeFileSync(
              typeFilePath,
              `type ${nameTitle} = {\n${content}\n};\n\nexport default ${nameTitle};\n`,
              "utf-8",
            );

            fileNames.push(name);
            nameTypes.push(nameTitle);
          }
        }
      });
    };

    recursiveFileStructure(baseDir);

    // Gera o arquivo "json-structures.type.d.ts" com as importações e exportações
    const imports = fileNames
      .map(
        (name) =>
          `import ${formatName(name, false)} from './${name}';\nexport * as ${formatName(name, false)} from './${name}';\n`,
      )
      .join("\n");
    const jsonTypes = `${imports}\n
/**
 * Types to represent the JSON structures of the files
 */
export type JsonTypes = ${nameTypes.join(" | ") || "any"};

/**
 * Types to represent the JSON files
 */
export type JsonFilesType = ${fileNames.map((name) => `"${name.toLowerCase()}"`).join(" | ") || "any"};
`;

    // Salva o arquivo "json-structures.type.d.ts"
    writeFileSync(join(typesDir, "index.d.ts"), jsonTypes, "utf-8");

    // // Presentation of the exported Type and Enum
    // let jsonTypes = `/**\n * Types to represent the JSON structures of the files\n */\n`;

    // // File exports
    // const types = fileNames.map((name) => `"${name.toLowerCase()}"`);
    // jsonTypes += `export type JsonTypes = ${nameTypes.join(" | ") || "any"};`;
    // jsonTypes += `\n\nexport type JsonFilesType = ${types.join(" | ") || "any"};`;

    // // Presentation of existing types
    // jsonTypes += `\n\n/**\n * Structures of each JSON file represented in a specific type\n${nameTypes.map((name) => ` * @see ${name}`).join("\n") || " *"}\n */`;

    // // Type contents
    // jsonTypes += !!typeFilesDefinitionContent
    //   ? `\n\n${typeFilesDefinitionContent}`
    //   : "\n";

    // // Saves the new JsonTypes file
    // writeFileSync(
    //   join(baseDir, "json-structures.type.d.ts"),
    //   jsonTypes,
    //   "utf-8",
    // );
  }
}
