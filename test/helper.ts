import { tmpdir } from 'os';
import { config } from 'dotenv';
import { join, resolve } from 'path';
import { execSync } from 'child_process';
import { mkdtempSync, writeFileSync } from 'fs';
import { ExecSyncOptionsWithBufferEncoding } from 'child_process';

config();
export const skipImplementationTests = process.env.SKIP_IMPLEMENTATION_TESTS === 'true';

var folderNumber = 0;
const versionsPath = resolve(join(__dirname, '../versions'));


interface EnvironmentOptions {
    libVersion?: string;
    module: 'cjs' | 'esm';
}

interface ExecuteOptions extends ExecSyncOptionsWithBufferEncoding {
    execPath: string;
    returnString?: boolean;
};


/**
 * Generate a environment with a temporary directory
 * to install and test the library version
 * 
 * @param module 
 * @param version 
 * @returns 
 */
export const generateEnv = (
    envOptions: EnvironmentOptions,
    executeOptions?: ExecuteOptions,
) => {
    const {
        module,
        libVersion = 'interpreter-1.0.0.tgz',
    } = envOptions;

    // Caminho do diretório temporário para o teste
    folderNumber++;
    const folderName = `test-folder-${folderNumber}`;
    const tempDir = mkdtempSync(join(tmpdir(), folderName));

    // Camihho para a versão da biblioteca que será instalada
    const tarballPath = resolve(join(versionsPath, libVersion));


    /**
     * Instala a biblioteca no diretório temporário
     * com base no módulo JavaScript utilizado
     * 
     * Caso seja CommonJs (cjs), será criado o arquivo de configuração `tsconfig.json`
     */
    if (module === 'esm') {
        execSync(`npm init -y && npm install "${tarballPath}"`, { cwd: tempDir });

    } else if (module === 'cjs') {
        execSync(`npm init -y && npm install "${tarballPath}" ts-node --save-dev`, { cwd: tempDir });

        const configFilePath = join(tempDir, 'tsconfig.json');
        writeFileSync(
            configFilePath,
            JSON.stringify({
                "compilerOptions": {
                    "module": "commonjs",
                    "target": "es2020"
                }
            })
        );
    }




    return {
        tempDir,
        tarballPath,
        exec: generateExecuteFunction(tempDir, executeOptions),
    };
};

const generateExecuteFunction = (
    tempDir: string,
    executeOptions?: ExecuteOptions,
) => {
    const {
        execPath,
        returnString = false,
    } = executeOptions;

    return (path?: string) => {
        const options = { cwd: tempDir, ...executeOptions };
        const filePathToExecute = path || join(tempDir, execPath);

        const result = execSync(`npx ts-node "${filePathToExecute}"`, options);

        if (!!returnString) return result.toString();
        else return result;
    }
}