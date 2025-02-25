import { join } from "path";
import { Exception } from "../../helper/exception";
import { existsSync, readdirSync, writeFileSync } from "fs";


export const generateJsonTypes = (baseDir: string) => {

    /** Content that will be generated in the file with the types */
    const nameTypes = [];
    let typesDefinitionContent: string = '';

    // Recursive function to access several levels
    const recursiveFileStructure = (dir: string): void => {
        const entries = readdirSync(dir, { withFileTypes: true });

        entries.forEach((entry) => {
            const entryPath = join(dir, entry.name);
            const isDirectory = entry.isDirectory();
            const name = entry.name.replace('.json', '');

            if (isDirectory || entry.name.endsWith('.json')) {
                if (isDirectory) recursiveFileStructure(entryPath);

                else {
                    const readFile = require(entryPath);

                    if (!existsSync(dir)) {
                        new Exception(`Type definition files directory not found: ${dir}`);
                    }

                    /**
                     * Function to convert the JSON structure in type
                     * @param object 
                     * @param indent 
                     * @returns 
                     */
                    const generateTypeDefinationJSON = (object: any, indent: number = 2): string => {
                        const entries = Object.entries(object)
                            .map(([key, value]) => {
                                if (typeof value === "string") {
                                    return `${" ".repeat(indent)}${key}: string;`;
                                } else if (typeof value === "object" && value !== null) {

                                    const lastIndent = `${" ".repeat(indent)}`;
                                    const firstIndentAndKey = `${" ".repeat(indent)}${key}`;
                                    const recursiveKeys = generateTypeDefinationJSON(value, indent + 2);

                                    return `${firstIndentAndKey}: {\n${recursiveKeys}\n${lastIndent}};`;
                                }
                                return "";
                            })
                            .filter(Boolean);

                        return entries.join("\n");
                    }

                    // Format the file name to TitleCase
                    const toTitleCase = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase()).replaceAll('-', '_').replaceAll('.', '_');
                    const nameTitle = toTitleCase(name);

                    // Convert the JSON structure in type
                    const content = generateTypeDefinationJSON(readFile);
                    typesDefinitionContent += `type ${nameTitle} = {\n${content}\n};\n\n`;

                    nameTypes.push(nameTitle);
                }
            }
        });
    }

    recursiveFileStructure(baseDir);
    typesDefinitionContent = `export type JsonTypes = ${nameTypes.join(' | ')};\n\n${typesDefinitionContent}`;

    writeFileSync(join(baseDir, `json-types.d.ts`), typesDefinitionContent, "utf-8");
}
