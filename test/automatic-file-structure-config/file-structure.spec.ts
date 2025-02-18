import { it, expect, describe } from 'vitest';
import { FileStructure } from '../../src/files/file-structure';

describe('FileStructure', () => {

    let locales = __dirname + '/locales';
    let outDirTypeDefinitionFiles = __dirname + '/type-definition-files';

    it('should be return a file structure by createFileStructure method', () => {
        const structure = FileStructure.createFileStructure(locales, outDirTypeDefinitionFiles);

        expect(structure['en']).toBeDefined();
        expect(structure['es']).toBeDefined();
        expect(structure['pt-br']).toBeDefined();
    });

    it('an error should be triggered for not finding the directory', () => {
        expect(() => FileStructure.createFileStructure('./test-locales', './any-path')).toThrow();
    });

    it('should not be able return the text file', () => {
        const structure = FileStructure.createFileStructure(locales, outDirTypeDefinitionFiles);

        expect(structure['en']).toBeDefined();
        expect(structure['text']).not.toBeDefined();
    });
});