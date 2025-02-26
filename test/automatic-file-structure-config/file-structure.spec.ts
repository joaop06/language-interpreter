import { it, expect, describe } from 'vitest';
import { FileLoader } from '../../src/files/file-loader';

describe('FileStructure', () => {

    let locales = __dirname + '/locales';

    it('should be return a file structure by createFileStructure method', () => {
        const structure = FileLoader.createFileStructure(locales);

        expect(structure['en']).toBeDefined();
        expect(structure['es']).toBeDefined();
        expect(structure['pt-br']).toBeDefined();
    });

    it('an error should be triggered for not finding the directory', () => {
        expect(() => FileLoader.createFileStructure('./test-locales')).toThrow();
    });

    it('should not be able return the text file', () => {
        const structure = FileLoader.createFileStructure(locales);

        expect(structure['en']).toBeDefined();
        expect(structure['text']).not.toBeDefined();
    });
});