import { join } from 'path';
import { Exception } from 'helper/exception';
import { readdirSync, writeFileSync, existsSync } from 'fs';

export type FileStructureType = {
    [key: string]: FileStructureType | {
        path: string;
        typeDefinition: Promise<any>;
    }
};

export class FileStructure {
    /**
     * Create the file structure using a
     * recursive function to create a file structure at any level
     * @param {string} dir 
     * @returns {FileStructureType}
     */
    static createFileStructure(dir: string, outDirTypeDefinitionFiles: string): FileStructureType {

        // Recursive function to access several levels
        const recursiveFileStructure = (dir: string): FileStructureType => {
            const entries = readdirSync(dir, { withFileTypes: true });

            return entries.reduce<FileStructureType>((acc, entry) => {
                const entryPath = join(dir, entry.name);
                const isDirectory = entry.isDirectory();
                const name = entry.name.replace('.json', '');

                if (isDirectory || entry.name.endsWith('.json')) {
                    if (isDirectory) acc[name] = recursiveFileStructure(entryPath);

                    if (!isDirectory) {
                        const readFile = require(entryPath);

                        const toTitleCase = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase()).replaceAll('-', '_').replaceAll('.', '_');

                        if (!existsSync(outDirTypeDefinitionFiles)) {
                            new Exception(`Type definition files directory not found: ${outDirTypeDefinitionFiles}`);
                        }

                        const nameTitle = toTitleCase(name);
                        const content = this.generateTypeDefinationJSON(readFile);
                        const typeDefinitionContent = `export type ${nameTitle} = {\n${content}\n};`;

                        const typeDirPath = join(outDirTypeDefinitionFiles, `${name}.d.ts`);


                        writeFileSync(typeDirPath, typeDefinitionContent, "utf-8");



                        const typeDefinition = import(typeDirPath);
                        acc[name] = {
                            typeDefinition,
                            path: entryPath,
                        };
                    }
                }

                return acc;
            }, {});
        }

        return recursiveFileStructure(dir);
    }

    private static generateTypeDefinationJSON(object: any, indent: number = 2): string {
        const entries = Object.entries(object)
            .map(([key, value]) => {
                if (typeof value === "string") {
                    return `${" ".repeat(indent)}${key}: string;`;
                } else if (typeof value === "object" && value !== null) {

                    const lastIndent = `${" ".repeat(indent)}`;
                    const firstIndentAndKey = `${" ".repeat(indent)}${key}`;
                    const recursiveKeys = this.generateTypeDefinationJSON(value, indent + 2);

                    return `${firstIndentAndKey}: {\n${recursiveKeys}\n${lastIndent}};`;
                }
                return "";
            })
            .filter(Boolean);

        return entries.join("\n");
    }
}