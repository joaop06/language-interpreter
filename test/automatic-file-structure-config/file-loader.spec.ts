import { describe, expect, it } from "vitest";
import { FileLoader } from "../../src/files/file-loader";

describe('FileLoader', () => {

    let locales = __dirname + '/locales';
    let outDirTypeDefinitionFiles = __dirname + '/type-definition-files';

    it('should be able return a FileLoader instance by init method', () => {
        const fileLoader = FileLoader.init(locales, outDirTypeDefinitionFiles);
        expect(fileLoader).toBeInstanceOf(FileLoader);
    });

    it('should be return a file structure', () => {
        const fileLoader = FileLoader.init(locales, outDirTypeDefinitionFiles);
        expect(fileLoader.structure['en']).toBeDefined();
    });

    it('an error should be triggered for not finding the directory', () => {
        expect(() => FileLoader.init('./test-locales', './any-path')).toThrow();
    });

    it('should be able read a file', () => {
        const fileLoader = FileLoader.init(locales, outDirTypeDefinitionFiles);

        const file = fileLoader.readFile('pt-br');
        expect(file).toBeDefined();
    });
});