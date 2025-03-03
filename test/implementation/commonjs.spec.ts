import { join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { it, expect, describe } from 'vitest';
import { generateEnv, skipImplementationTests } from '../helper';

describe.skipIf(skipImplementationTests)('CommonJs Implementation', () => {

    it('no such locales directory', () => {
        const { exec, tempDir } = generateEnv(
            { module: 'cjs' },
            { returnString: true, execPath: 'index.ts', stdio: ['pipe', 'pipe', 'pipe'] }
        );

        const localesDir = join(tempDir, 'locales');
        const testFilePath = join(tempDir, 'index.ts');

        writeFileSync(
            testFilePath,
            `import { Interpreter } from 'interpreter';
            const interpreter = new Interpreter({
                defaultLanguage: 'example',
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });`
        );

        try {
            exec();
        } catch (e: any) {
            const error = e.stderr.toString();
            expect(error).toContain(`Error: ENOENT: no such file or directory, scandir '${localesDir}'`);
        } finally {
            expect(exec).toThrow();
        }
    });

    it('should be able create a new instance of the Interpreter without locale files', () => {

        const { exec, tempDir } = generateEnv(
            { module: 'cjs' },
            { execPath: 'index.ts', returnString: true }
        );

        // Diretório temporário para os arquivos de traduções
        const localesDir = join(tempDir, 'locales');
        mkdirSync(localesDir, { recursive: true });

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        const testFilePath = join(tempDir, 'index.ts');
        writeFileSync(
            testFilePath,
            `import { Interpreter } from 'interpreter';

            const interpreter = new Interpreter({
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });`
        );

        // Verifica a saída
        expect(exec).not.toThrow();
    });

    it('should return an error when trying to translate a key not found', () => {

        const { exec, tempDir } = generateEnv(
            { module: 'cjs' },
            { returnString: true, execPath: 'index.ts', stdio: ['pipe', 'pipe', 'pipe'] }
        );

        // Diretório temporário para os arquivos de traduções
        const localesDir = join(tempDir, 'locales');
        mkdirSync(localesDir, { recursive: true });
        writeFileSync(
            join(localesDir, 'example.json'),
            JSON.stringify({ key: 'value', key2: 'value2' })
        );

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        const testFilePath = join(tempDir, 'index.ts');
        writeFileSync(
            testFilePath,
            `import { Interpreter } from 'interpreter';

            const interpreter = new Interpreter({
                defaultLanguage: 'example',
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });
            console.log(interpreter.translate('key1'));`
        );

        try {
            exec();
        } catch (e: any) {
            const error = e.stderr.toString();
            expect(error).toContain('Exception: Key not found: key1');
        } finally {
            expect(exec).toThrow();
        }
    });

    it('should be able translate a example key', () => {
        const { exec, tempDir } = generateEnv({ module: 'cjs' });

        // Diretório temporário para os arquivos de traduções
        const localesDir = join(tempDir, 'locales');
        mkdirSync(localesDir, { recursive: true });
        writeFileSync(
            join(localesDir, 'example.json'),
            JSON.stringify({ key: 'value', key2: 'value2' })
        );

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        const testFilePath = join(tempDir, 'index.ts');
        writeFileSync(
            testFilePath,
            `import { Interpreter } from 'interpreter';

            const interpreter = new Interpreter({
                defaultLanguage: 'example',
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });
            console.log(interpreter.translate('key'));`
        );

        // Verifica a saída
        expect(exec).not.toThrow();
    });
});