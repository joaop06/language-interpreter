import { it, expect, describe } from 'vitest';
import { FileStructure } from '../../src/files/file-structure';

describe('FileStructure', () => {

    let locales = __dirname + '/locales';

    it('should be return a file structure by createFileStructure method', () => {
        const structure = FileStructure.createFileStructure(locales);

        expect(structure['en']).toBeDefined();
        expect(structure['es']).toBeDefined();
        expect(structure['pt-br']).toBeDefined();
        expect(structure['pt-br']['errors']).toBeDefined();
    });

    it('an error should be triggered for not finding the directory', () => {
        expect(() => FileStructure.createFileStructure('./test-locales')).toThrow();
    });

    it('should be return a specific file structure', () => {
        const structure = FileStructure.createFileStructure(locales + '/pt-br');
        expect(structure['errors']).toBeDefined();
    });
});