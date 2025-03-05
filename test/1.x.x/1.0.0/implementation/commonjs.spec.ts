import { it, expect, describe } from 'vitest';
import { generateEnv } from '../../../helper/helper';

describe.concurrent('CommonJs Implementation', () => {

    it('no such locales directory', () => {
        const { exec, createLocaleFiles, createTestFile } = generateEnv({
            module: 'cjs',
            returnString: true,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        createTestFile(
            `import { Interpreter } from 'interpreter';
            const interpreter = new Interpreter({
                defaultLanguage: 'example',
                basePath: "./locales"
            });`
        );

        const localesDir = createLocaleFiles();

        try {
            exec(false);
        } catch (e: any) {
            const error = e.stderr.toString();
            expect(error).toContain(`Error: ENOENT: no such file or directory, scandir '${localesDir}'`);
        } finally {
            expect(exec).toThrow();
        }
    });

    it('should be able create a new instance of the Interpreter without locale files', () => {
        const { exec, createLocaleFiles, createTestFile } = generateEnv({
            module: 'cjs',
            returnString: true
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles();

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createTestFile(
            `import { Interpreter } from 'interpreter';

            const interpreter = new Interpreter({
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });`
        );

        // Verifica a saída
        expect(exec).not.toThrow();
    });

    it('should return an error when trying to translate a key not found', () => {
        const { exec, createLocaleFiles, createTestFile } = generateEnv({
            module: 'cjs',
            returnString: true,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: 'value', key2: 'value2' } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createTestFile(
            `import { Interpreter } from 'interpreter';

            const interpreter = new Interpreter({
                defaultLanguage: 'example',
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });
            console.log(interpreter.translate('key1'));`
        );

        try {
            exec(false);
        } catch (e: any) {
            const error = e.stderr.toString();
            expect(error).toContain('Exception: Key not found: key1');
        } finally {
            expect(exec).toThrow();
        }
    });

    it('should be able translate a example key', () => {
        const { exec, createLocaleFiles, createTestFile } = generateEnv({
            module: 'cjs',
            returnString: true
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: 'value', key2: 'value2' } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createTestFile(
            `import { Interpreter } from 'interpreter';

            const interpreter = new Interpreter({
                defaultLanguage: 'example',
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });
            console.log(interpreter.translate('key'));`
        );

        // Verifica a saída
        expect(exec(false)).toBe('value');
        expect(exec).not.toThrow();
    });

    it('should be able set a new default language', () => {
        const { exec, createLocaleFiles, createTestFile } = generateEnv({
            module: 'cjs',
            returnString: true
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: 'value', key2: 'value2' } },
            { example2: { key3: 'value3', key4: 'value4' } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createTestFile(
            `import { Interpreter } from 'interpreter';

            const interpreter = new Interpreter({
                defaultLanguage: 'example',
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });
           
            interpreter.language = 'example2';
            console.log(interpreter.translate('key3'));`
        );

        // Verifica a saída
        expect(exec(false)).toBe('value3');
        expect(exec).not.toThrow();
    });

    it('should return an error when set a new language and trying translate a key not found', () => {
        const { exec, createLocaleFiles, createTestFile } = generateEnv({
            module: 'cjs',
            returnString: true
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: 'value', key2: 'value2' } },
            { example2: { key3: 'value3', key4: 'value4' } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createTestFile(
            `import { Interpreter } from 'interpreter';

            const interpreter = new Interpreter({
                defaultLanguage: 'example',
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });
            console.log(interpreter.translate('key'));
            
            interpreter.language = 'example2';
            console.log(interpreter.translate('key5'));`
        );

        try {
            exec(false);
        } catch (e: any) {
            const error = e.stderr.toString();
            expect(error).toContain('Exception: Key not found: key5');
        } finally {
            expect(exec).toThrow();
        }
    });

    it('should return an error when set a new language and trying translate a old key', () => {
        const { exec, createLocaleFiles, createTestFile } = generateEnv({
            module: 'cjs',
            returnString: true
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: 'value', key2: 'value2' } },
            { example2: { key3: 'value3', key4: 'value4' } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createTestFile(
            `import { Interpreter } from 'interpreter';

            const interpreter = new Interpreter({
                defaultLanguage: 'example',
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });
            console.log(interpreter.translate('key'));
            
            interpreter.language = 'example2';
            console.log(interpreter.translate('key'));`
        );

        try {
            exec(false);
        } catch (e: any) {
            const error = e.stderr.toString();
            expect(error).toContain('Exception: Key not found: key');
        } finally {
            expect(exec).toThrow();
        }
    });

    it('it should be possible to implement the library and then type based on the generated JsonTypes file', () => {
        const { exec, createLocaleFiles, createTestFile } = generateEnv({
            module: 'cjs',
            returnString: true
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: 'value', key2: 'value2' } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createTestFile(
            `import { Interpreter } from 'interpreter';

            const interpreter = new Interpreter({
                defaultLanguage: 'example',
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });
            console.log(interpreter.translate('key'));`
        );

        expect(() => exec(false)).not.toThrow();

        // Sobrescrever o arquivo index.ts com a nova importação
        createTestFile(
            `import { Interpreter } from 'interpreter';
            import { JsonTypes } from './locales/json-structures.type';

            const interpreter = new Interpreter<JsonTypes>({
                defaultLanguage: 'example',
                basePath: "${localesDir.replace(/\\/g, '\\\\')}"
            });
            console.log(interpreter.translate('key'));`
        );

        expect(exec()).toBe('value');
    });
});