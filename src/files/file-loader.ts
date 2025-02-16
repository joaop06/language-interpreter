import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import { Exception } from '../exception';
import { FileStructure, FileStructureType } from './file-structure';

export class FileLoader<T extends FileStructureType> {

    private basePath: string;

    constructor(
        basePath: string,
        public structure: T,
    ) {
        this.basePath = resolve(basePath);
    }

    static init(basePath: string): FileLoader<any> {
        const structure = FileStructure.createFileStructure(basePath);
        return new FileLoader<typeof structure>(basePath, structure);
    }

    public readFile(filePath: string): string {
        const fullPath = this.resolvePath(filePath, this.structure);

        if (!fullPath) new Exception(`File not found: ${filePath}`);

        // return readFileSync(fullPath, 'utf-8');
        return require(fullPath);
    }

    private resolvePath(filePath: string, structure: any): string | null {
        let current = structure;
        const parts = filePath.split('.');

        for (let part of parts) {
            if (!current[part]) return null;
            current = current[part];
        }

        return typeof current === 'string' ? current : null;
    }
}
