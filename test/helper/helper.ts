import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { execSync } from 'child_process';
import { mkdirSync, mkdtempSync, rmdirSync, writeFileSync } from 'fs';

var folderNumber = 0;
const versionsPath = resolve(join(__dirname, '../../versions'));

type IOType = "overlapped" | "pipe" | "ignore" | "inherit";
interface GenerateEnvInterface {
    /** EnvironmentOptions */
    libVersion?: string,
    module: 'cjs' | 'esm',

    /** ExecuteOptions */
    returnString?: boolean,
    stdio?: IOType | Array<IOType | undefined> | undefined,
}

/**
 * Generate a environment with a temporary directory
 * to install and test the library version
 * 
 * @param module 
 * @param version 
 * @returns 
 */
export const generateEnv = ({
    stdio,
    module,
    returnString = false,
    libVersion = 'interpreter-1.0.0.tgz',
}: GenerateEnvInterface) => {
    // Caminho do diretório temporário para o teste
    folderNumber++;
    const folderName = `interpreter-temp-folder-${folderNumber}`;
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
        createTestFile: createTestFile(tempDir),
        createLocaleFiles: createLocaleFiles(tempDir),
        exec: generateExecuteFunction({ module, tempDir, stdio, returnString }),
    };
};

const createLocaleFiles = (tempDir: string) => {
    const localesDir = join(tempDir, 'locales');

    return (files = []) => {
        mkdirSync(localesDir, { recursive: true });

        for (const file of files) {
            const fileName = Object.keys(file)[0];
            const content = JSON.stringify(file[fileName]);
            writeFileSync(join(localesDir, `${fileName}.json`), content);
        }
        return localesDir;
    }
}

const createTestFile = (tempDir: string) => {
    return (content: string) => {
        const testFilePath = join(tempDir, 'index.ts');
        writeFileSync(testFilePath, content);
        return testFilePath;
    };
};

const generateExecuteFunction = ({
    module,
    tempDir,

    /** ExecuteOptions */
    stdio,
    returnString,
}: { tempDir: string } & Partial<GenerateEnvInterface>) => {

    return (removeTempDir: boolean = true): string | Buffer<ArrayBufferLike> => {
        const options = { cwd: tempDir, stdio };
        const filePathToExecute = join(tempDir, module === 'cjs' ? 'index.ts' : 'index.js');

        const result = execSync(`npx ts-node "${filePathToExecute}"`, options);

        if (removeTempDir) rmdirSync(tempDir, { recursive: true });

        if (!!returnString) return result.toString().trim();
        else return result;
    }
};
