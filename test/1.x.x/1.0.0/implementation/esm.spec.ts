import { it, expect, describe } from "vitest";
import { generateEnv } from "../../../helper/helper";

describe.concurrent("ESM Implementation", () => {

    it('should load the ESM module using require', () => {
        const { exec, createFile } = generateEnv(
            {
                module: 'esm',
                returnString: true,
            },
        );

        // Cria o arquivo de teste
        createFile(
            `const { Interpreter } = require('interpreter');
            console.log('Module loaded successfully');`
        );

        // Verifica se o módulo foi carregado sem erros
        expect(() => exec(false)).not.toThrow();
        expect(exec()).toBe('Module loaded successfully');
    });

    it("no such locales directory", () => {
        const { exec, createFile } = generateEnv({
            module: "esm",
            returnString: true,
        });

        createFile(
            `const { Interpreter } = require('interpreter');
                const interpreter = new Interpreter({
                    defaultLanguage: 'example',
                    basePath: "./locales"
                });`,
        );

        try {
            exec(false);
        } catch (e: any) {
            const error = e.stderr.toString();
            expect(error).toContain(
                `ENOENT: no such file or directory, scandir './locales'`,
            );
        } finally {
            expect(() => exec()).toThrow();
        }
    });

    it("should be able create a new instance of the Interpreter without locale files", () => {
        const { exec, createLocaleFiles, createFile } = generateEnv({
            module: "esm",
            returnString: true,
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles();

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createFile(
            `const { Interpreter } = require('interpreter');
    
                const interpreter = new Interpreter({
                    basePath: "${localesDir.replace(/\\/g, "\\\\")}"
                });`,
        );

        // Verifica a saída
        expect(exec).not.toThrow();
    });

    it("should return an error when trying to translate a key not found", () => {
        const { exec, createLocaleFiles, createFile } = generateEnv({
            module: "esm",
            returnString: true,
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: "value", key2: "value2" } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createFile(
            `const { Interpreter } = require('interpreter');
    
                const interpreter = new Interpreter({
                    defaultLanguage: 'example',
                    basePath: "${localesDir.replace(/\\/g, "\\\\")}"
                });
                console.log(interpreter.translate('key1'));`,
        );

        try {
            exec(false);
        } catch (e: any) {
            const error = e.stderr.toString();
            expect(error).toContain("Exception: Key not found: key1");
        } finally {
            expect(exec).toThrow();
        }
    });

    it("should be able translate a example key", () => {
        const { exec, createLocaleFiles, createFile } = generateEnv({
            module: "esm",
            returnString: true,
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: "value", key2: "value2" } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createFile(
            `const { Interpreter } = require('interpreter');
    
                const interpreter = new Interpreter({
                    defaultLanguage: 'example',
                    basePath: "${localesDir.replace(/\\/g, "\\\\")}"
                });
                console.log(interpreter.translate('key'));`,
        );

        // Verifica a saída
        expect(exec(false)).toBe("value");
        expect(exec).not.toThrow();
    });

    it("should be able set a new default language", () => {
        const { exec, createLocaleFiles, createFile } = generateEnv({
            module: "esm",
            returnString: true,
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: "value", key2: "value2" } },
            { example2: { key3: "value3", key4: "value4" } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createFile(
            `const { Interpreter } = require('interpreter');
    
                const interpreter = new Interpreter({
                    defaultLanguage: 'example',
                    basePath: "${localesDir.replace(/\\/g, "\\\\")}"
                });
               
                interpreter.language = 'example2';
                console.log(interpreter.translate('key3'));`,
        );

        // Verifica a saída
        expect(exec(false)).toBe("value3");
        expect(exec).not.toThrow();
    });

    it("should return an error when set a new language and trying translate a key not found", () => {
        const { exec, createLocaleFiles, createFile } = generateEnv({
            module: "esm",
            returnString: true,
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: "value", key2: "value2" } },
            { example2: { key3: "value3", key4: "value4" } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createFile(
            `const { Interpreter } = require('interpreter');
    
                const interpreter = new Interpreter({
                    defaultLanguage: 'example',
                    basePath: "${localesDir.replace(/\\/g, "\\\\")}"
                });
                console.log(interpreter.translate('key'));
                
                interpreter.language = 'example2';
                console.log(interpreter.translate('key5'));`,
        );

        try {
            exec(false);
        } catch (e: any) {
            const error = e.stderr.toString();
            expect(error).toContain("Exception: Key not found: key5");
        } finally {
            expect(exec).toThrow();
        }
    });

    it("should return an error when set a new language and trying translate a old key", () => {
        const { exec, createLocaleFiles, createFile } = generateEnv({
            module: "esm",
            returnString: true,
        });

        // Diretório temporário para os arquivos de traduções
        const localesDir = createLocaleFiles([
            { example: { key: "value", key2: "value2" } },
            { example2: { key3: "value3", key4: "value4" } },
        ]);

        /**
         * Cria o arquivo index no diretório temporário
         * com o código para o teste da implementação
         */
        createFile(
            `const { Interpreter } = require('interpreter');
    
                const interpreter = new Interpreter({
                    defaultLanguage: 'example',
                    basePath: "${localesDir.replace(/\\/g, "\\\\")}"
                });
                console.log(interpreter.translate('key'));
                
                interpreter.language = 'example2';
                console.log(interpreter.translate('key'));`,
        );

        try {
            exec(false);
        } catch (e: any) {
            const error = e.stderr.toString();
            expect(error).toContain("Exception: Key not found: key");
        } finally {
            expect(exec).toThrow();
        }
    });
});
