import * as fs from 'fs';
import * as path from 'path';
import { FileStructure } from './types/files-structure.type';

export class FileLoader<T extends FileStructure> {

    private _structure: T;
    private _basePath: string;

    constructor(basePath: string) {
        this._basePath = path.resolve(basePath);
        this._structure = this.createFileStructure(basePath) as T;
    }

    public getStructure(): T {
        return this._structure;
    }

    private createFileStructure(dir: string): FileStructure {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        return entries.reduce<FileStructure>((acc, entry) => {
            const name = entry.name;
            const entryPath = path.join(dir, name);

            if (!entry.isDirectory()) acc[name] = entryPath;
            else acc[name] = this.createFileStructure(entryPath);

            return acc;
        }, {});
    }

    public readFile(filePath: string): string {
        const fullPath = this.resolvePath(filePath, this._structure);

        if (!fullPath) {
            throw new Error(`File not found: ${filePath}`);
        }

        return fs.readFileSync(fullPath, 'utf-8');
    }

    private resolvePath(filePath: string, structure: any): string | null {
        let current = structure;
        const parts = filePath.split('/');

        for (let part of parts) {
            if (!current[part]) return null;
            current = current[part];
        }

        return typeof current === 'string' ? current : null;
    }
}
