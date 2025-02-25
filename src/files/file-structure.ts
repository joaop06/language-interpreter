import { join } from 'path';
import { readdirSync } from 'fs';

export type FileStructureType = {
    [key: string]: FileStructureType | string;
};

export class FileStructure {
    /**
     * Create the file structure using a
     * recursive function to create a file structure at any level
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
                const name = entry.name.replace('.json', '');

                if (isDirectory || entry.name.endsWith('.json')) {
                    if (!isDirectory) acc[name] = entryPath;
                    else acc[name] = recursiveFileStructure(entryPath);
                }

                return acc;
            }, {});
        }

        return recursiveFileStructure(dir);
    }
}