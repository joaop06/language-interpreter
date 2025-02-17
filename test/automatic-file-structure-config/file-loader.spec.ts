import { describe, expect, it } from "vitest";
import { FileLoader } from "../../src/files/file-loader";

describe('FileLoader', () => {

    let locales = __dirname + '/locales';

    it('should be able return a FileLoader instance by init method', () => {
        const fileLoader = FileLoader.init(locales);
        expect(fileLoader).toBeInstanceOf(FileLoader);
    });

    it('should be return a file structure', () => {
        const fileLoader = FileLoader.init(locales);
        expect(fileLoader.structure['en']).toBeDefined();
    });

    it('an error should be triggered for not finding the directory', () => {
        expect(() => FileLoader.init('./test-locales')).toThrow();
    });

    it('should be return a specific file structure', () => {
        const fileLoader = FileLoader.init(locales + '/pt-br');
        expect(fileLoader.structure['errors']).toBeDefined();
    });

    it('should be able read a file', () => {
        const fileLoader = FileLoader.init(locales);

        const file = fileLoader.readFile('pt-br.errors');
        expect(file).toBeDefined();
    });
});