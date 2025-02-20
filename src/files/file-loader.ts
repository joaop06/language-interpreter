import { resolve } from 'path';
import { Exception } from '../../helper/exception';
import { FileStructure, FileStructureType } from './file-structure';

export class FileLoader<T extends FileStructureType> {

    constructor(
        public basePath: string,
        public structure: T,
    ) {
        this.basePath = resolve(basePath);
    }

    static init(basePath: string): FileLoader<any> {
        const structure = FileStructure.createFileStructure(basePath);
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
}
