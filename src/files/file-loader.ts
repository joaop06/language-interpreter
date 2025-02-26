import { join, resolve } from 'path';
import { Exception } from '../../helper/exception';
import { readdirSync } from 'fs';

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

        if (!fullPath) new Exception(`File not found: ${fileName}`);

        return require(resolve(fullPath));
    }

    private resolvePath(fileName: string, structure: any): string | null {
        let current = structure;
        const parts = fileName.split('.');

        for (let part of parts) {
            if (!current[part]) return null;
            current = current[part];
        }

        return typeof current === 'string' ? current : null;
    }

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
