import { tmpdir } from "os";
import { join, resolve } from "path";
import { execSync } from "child_process";
import { mkdirSync, mkdtempSync, rmdirSync, writeFileSync } from "fs";

let folderNumber = 0;
const versionsPath = resolve(join(__dirname, "../versions"));

interface GenerateEnvInterface {
  /** EnvironmentOptions */
  libVersion?: string;
  module: "cjs" | "esm";

  /** ExecuteOptions */
  returnString?: boolean;
}

export const rmdir = (tempDir: string) => {
  rmdirSync(tempDir, { recursive: true });
};

export const generateTempDir = (folderName: string) => {
  return mkdtempSync(join(tmpdir(), folderName));
};

/**
 * Generate a environment with a temporary directory
 * to install and test the library version
 *
 * @param module
 * @param version
 * @returns
 */
export const generateEnv = ({
  module,
  returnString = false,
  libVersion = "language-interpreter-1.0.0.tgz",
}: GenerateEnvInterface) => {
  // Path of the temporary directory for the test
  folderNumber++;
  const tempDir = generateTempDir(
    `language-interpreter-temp-folder-${folderNumber}`,
  );

  // Path to the version of the library to be installed
  const tarballPath = resolve(join(versionsPath, libVersion));

  /**
   * Installs the library in the temporary directory based on the JavaScript module used
   *
   * If it is CommonJs (cjs), the configuration file `tsconfig.json` will be created.
   */
  if (module === "esm") {
    execSync(`npm init -y && npm install "${tarballPath}"`, { cwd: tempDir });
  } else if (module === "cjs") {
    execSync(`npm init -y && npm install "${tarballPath}" ts-node --save-dev`, {
      cwd: tempDir,
    });

    const configFilePath = join(tempDir, "tsconfig.json");
    writeFileSync(
      configFilePath,
      JSON.stringify({
        compilerOptions: {
          module: "commonjs",
          target: "es2020",
        },
      }),
    );
  }

  return {
    tempDir,
    tarballPath,
    createFile: createFile({ tempDir, module }),
    createLocaleFiles: createLocaleFiles(tempDir),
    exec: exec({ module, tempDir, returnString }),
  };
};

const createLocaleFiles = (tempDir: string) => {
  const localesDir = join(tempDir, "locales");

  return (files = []) => {
    mkdirSync(localesDir, { recursive: true });

    for (const file of files) {
      const fileName = Object.keys(file)[0];
      const content = JSON.stringify(file[fileName]);
      writeFileSync(join(localesDir, `${fileName}.json`), content);
    }
    return localesDir;
  };
};

const createFile = ({
  module,
  tempDir,
}: { tempDir: string } & Partial<GenerateEnvInterface>) => {
  return (content: string) => {
    const testFilePath = join(
      tempDir,
      module === "cjs" ? "index.ts" : "index.js",
    );
    writeFileSync(testFilePath, content);
    return testFilePath;
  };
};

const exec = ({
  module,
  tempDir,

  /** ExecuteOptions */
  returnString,
}: { tempDir: string } & Partial<GenerateEnvInterface>) => {
  return (removeTempDir: boolean = true): string | Buffer<ArrayBufferLike> => {
    let result;

    const filePathToExecute = join(
      tempDir,
      module === "cjs" ? "index.ts" : "index.js",
    );

    try {
      if (module === "cjs") {
        result = execSync(`npx ts-node "${filePathToExecute}"`, {
          cwd: tempDir,
          stdio: ["pipe", "pipe", "pipe"],
        });
      } else if (module === "esm") {
        result = execSync(`node "${filePathToExecute}"`, {
          cwd: tempDir,
          stdio: ["pipe", "pipe", "pipe"],
        });
      }
    } catch (e) {
      /**
       * If you don't want to remove the directory,
       * you'll get an error because you'll run it again later, removing the directory
       */
      if (!removeTempDir) throw e;
    }

    if (removeTempDir) rmdir(tempDir);

    if (!!returnString) return result.toString().trim();
    else return result;
  };
};
