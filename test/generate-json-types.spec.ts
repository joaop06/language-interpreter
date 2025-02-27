import { join } from 'path';
import { FileLoader } from '../src/files/file-loader';
import { it, expect, describe, afterEach, beforeEach } from 'vitest';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs';

describe('generateTypes', () => {

    const testDir = join(__dirname, 'test-locales');

    beforeEach(() => {
        // Cria um diretório de teste antes de cada teste
        mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
        // Remove o diretório de teste após cada teste
        rmSync(testDir, { recursive: true, force: true });
    });

    it('must create the types based on the JSON files', () => {
        const dir = __dirname + '/locales';

        FileLoader.generateTypes(dir);

        const recursiveFiles = (dir: string): void => {
            readdirSync(dir, { withFileTypes: true }).forEach(entry => {
                const entryPath = join(dir, entry.name);
                const isDirectory = entry.isDirectory();

                if (isDirectory || entry.name.endsWith('.d.ts')) {
                    if (isDirectory) recursiveFiles(entryPath);
                    else expect(existsSync(entryPath)).toBe(true);
                }
            });
        }

        recursiveFiles(dir);
    });

    it('must create the types based on the JSON files', () => {
        // Cria alguns arquivos JSON no diretório de teste
        writeFileSync(join(testDir, 'example1.json'), JSON.stringify({ key1: 'value1', key2: 'value2' }));
        writeFileSync(join(testDir, 'example2.json'), JSON.stringify({ nested: { key: 'value' } }));

        FileLoader.generateTypes(testDir);

        // Verifica se o arquivo de tipos foi criado
        const typeFilePath = join(testDir, 'json-types.d.ts');
        expect(existsSync(typeFilePath)).toBe(true);

        // Verifica o conteúdo do arquivo de tipos
        const typeFileContent = readFileSync(typeFilePath, 'utf-8');
        expect(typeFileContent).toContain('export type Example1 = {');
        expect(typeFileContent).toContain('export type Example2 = {');
        expect(typeFileContent).toContain('key1: string;');
        expect(typeFileContent).toContain('nested: {');
    });

    it('must handle empty directories correctly', () => {
        FileLoader.generateTypes(testDir);

        // Verifica se o arquivo de tipos foi criado, mesmo que o diretório esteja vazio
        const typeFilePath = join(testDir, 'json-types.d.ts');
        expect(existsSync(typeFilePath)).toBe(true);

        // Verifica se o arquivo de tipos está vazio (apenas com a estrutura básica)
        const typeFileContent = readFileSync(typeFilePath, 'utf-8');
        expect(typeFileContent).toContain('export type JsonTypes = ;');
        expect(typeFileContent).toContain('export type JsonFilesType = ;');
    });

    it('must throw an exception when the directory does not exist', () => {
        const nonExistentDir = join(testDir, 'non-existent');

        expect(() => FileLoader.generateTypes(nonExistentDir)).toThrow();
    });

    it('must handle invalid JSON files correctly', () => {
        // Cria um arquivo JSON malformado
        writeFileSync(join(testDir, 'invalid.json'), '{"key": "value"');

        expect(() => FileLoader.generateTypes(testDir)).toThrow();
    });

    it('must handle directories with subdirectories correctly', () => {
        // Cria uma estrutura de diretórios com subdiretórios e arquivos JSON
        mkdirSync(join(testDir, 'subdir'));
        writeFileSync(join(testDir, 'subdir', 'example3.json'), JSON.stringify({ key3: 'value3' }));

        FileLoader.generateTypes(testDir);

        // Verifica se o arquivo de tipos foi criado e contém os tipos corretos
        const typeFilePath = join(testDir, 'json-types.d.ts');
        expect(existsSync(typeFilePath)).toBe(true);

        const typeFileContent = readFileSync(typeFilePath, 'utf-8');
        expect(typeFileContent).toContain('export type Example3 = {');
        expect(typeFileContent).toContain('key3: string;');
    });
});