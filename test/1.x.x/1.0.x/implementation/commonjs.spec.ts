import { config } from "dotenv";
import { it, expect, describe } from "vitest";
import { generateEnv } from "../../../helper";

config();

const skipTests = process.env.SKIP_IMPLEMENTATION_TESTS === "true";

describe.skipIf(skipTests).concurrent("CommonJs Implementation", () => {
  it("should load the CommonJs module using import", () => {
    const { exec, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Creates the test file
    createFile(`
      import { Interpreter } from 'language-interpreter';
      console.log('Module loaded successfully');
    `);

    // Checks that the module has been loaded without errors
    expect(() => exec(false)).not.toThrow();
    expect(exec()).toBe("Module loaded successfully");
  });

  it("no such locales directory", () => {
    const { exec, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    createFile(`
      import { Interpreter } from 'language-interpreter';
      const interpreter = new Interpreter({
          defaultLanguage: 'example',
          localesPath: "./locales"
      });
    `);

    try {
      exec(false);
    } catch (e: any) {
      const error = e.stderr.toString();
      expect(error).toContain(`Locales path not found: path "./locales"`);
    } finally {
      expect(() => exec()).toThrow();
    }
  });

  it("should be able create a new instance of the Interpreter without locale files", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles();

    /**
     * Creates the index file in the temporary directory
     * with the code for testing the implementation
     */
    createFile(`
      import { Interpreter } from 'language-interpreter';
      const interpreter = new Interpreter({
          localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
      });
    `);

    expect(exec).not.toThrow();
  });

  it("should return an error when trying to translate a key not found", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { example: { key: "value", key2: "value2" } },
    ]);

    createFile(`
      import { Interpreter } from 'language-interpreter';

      const interpreter = new Interpreter({
          defaultLanguage: 'example',
          localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
      });
      console.log(interpreter.translate('key1'));
    `);

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
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { example: { key: "value", key2: "value2" } },
    ]);

    createFile(`
      import { Interpreter } from 'language-interpreter';

      const interpreter = new Interpreter({
          defaultLanguage: 'example',
          localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
      });
      console.log(interpreter.translate('key'));
    `);

    expect(exec(false)).toBe("value");
    expect(exec).not.toThrow();
  });

  it("should be able set a new default language", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { example: { key: "value", key2: "value2" } },
      { example2: { key3: "value3", key4: "value4" } },
    ]);

    createFile(`
      import { Interpreter } from 'language-interpreter';

      const interpreter = new Interpreter({
          defaultLanguage: 'example',
          localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
      });
      
      interpreter.setDefaultLanguage('example2');
      console.log(interpreter.translate('key3'));
    `);

    expect(exec(false)).toBe("value3");
    expect(exec).not.toThrow();
  });

  it("should return an error when set a new language and trying translate a key not found", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { example: { key: "value", key2: "value2" } },
      { example2: { key3: "value3", key4: "value4" } },
    ]);

    createFile(`
      import { Interpreter } from 'language-interpreter';

      const interpreter = new Interpreter({
          defaultLanguage: 'example',
          localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
      });
      console.log(interpreter.translate('key'));
      
      interpreter.setDefaultLanguage('example2');
      console.log(interpreter.translate('key5'));
    `);

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
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { example: { key: "value", key2: "value2" } },
      { example2: { key3: "value3", key4: "value4" } },
    ]);

    createFile(`
      import { Interpreter } from 'language-interpreter';

      const interpreter = new Interpreter({
          defaultLanguage: 'example',
          localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
      });
      console.log(interpreter.translate('key'));
      
      interpreter.setDefaultLanguage('example2');
      console.log(interpreter.translate('key'));
    `);

    try {
      exec(false);
    } catch (e: any) {
      const error = e.stderr.toString();
      expect(error).toContain("Exception: Key not found: key");
    } finally {
      expect(exec).toThrow();
    }
  });

  it("it should be possible to implement the library and then type based on the generated LanguagesTypes file", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { example: { key: "value", key2: "value2" } },
    ]);

    expect(() => {
      createFile(`
        import { Interpreter } from 'language-interpreter';
  
        const interpreter = new Interpreter({
            defaultLanguage: 'example',
            localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
        });
        console.log(interpreter.translate('key'));
      `);

      exec(false);
    }).not.toThrow();

    // Overwrite the index.ts file with the new import
    createFile(`
      import { Interpreter } from 'language-interpreter';
      import { LanguagesTypes } from './locales/types';

      const interpreter = new Interpreter<LanguagesTypes>({
          defaultLanguage: 'example',
          localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
      });
      console.log(interpreter.translate('key'));
    `);

    expect(exec()).toBe("value");
  });

  it("should not be able set a non existent language", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { example: { key: "value", key2: "value2" } },
    ]);

    expect(() => {
      createFile(`
        import { Interpreter } from 'language-interpreter';
  
        const interpreter = new Interpreter({
            defaultLanguage: 'example',
            localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
        });
      `);

      exec(false);
    }).not.toThrow();

    createFile(`
      import { Interpreter } from 'language-interpreter';
      import { LanguagesTypes } from './locales/types';

      const interpreter = new Interpreter<LanguagesTypes>({
          defaultLanguage: 'example',
          localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
      });
      
      interpreter.setDefaultLanguage('example2');
    `);

    try {
      exec(false);
    } catch (e: any) {
      const error = e.stderr.toString();
      expect(error).toContain(`Language file "example2" not found`);
    } finally {
      expect(exec).toThrow();
    }
  });

  it("should not be able translate a message without code", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { example: { key: "value", key2: "value2" } },
    ]);

    createFile(`
      import { Interpreter } from 'language-interpreter';
      
      const interpreter = new Interpreter({
          defaultLanguage: 'example',
          localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
      });
      
      console.log(interpreter.translate(''));
    `);

    try {
      exec(false);
    } catch (e: any) {
      const error = e.stderr.toString();
      expect(error).toContain(`The key from message is missing`);
    } finally {
      expect(exec).toThrow();
    }
  });

  it("should return an error because the message needs argument, but is not given", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { example: { key: "value", hello: "Hello, {{name}}!!" } },
    ]);

    createFile(`
        import { Interpreter } from 'language-interpreter';
        
        const interpreter = new Interpreter({
            defaultLanguage: 'example',
            localesPath: "${localesDir.replace(/\\/g, "\\\\")}"
        });
        
        console.log(interpreter.translate('hello'));
      `);

    try {
      exec(false);
    } catch (e: any) {
      const error = e.stderr.toString();
      expect(error).toContain(
        `Arguments are needed for the desired message: hello`,
      );
    } finally {
      expect(exec).toThrow();
    }
  });

  it("must be able to translate a message with an argument in implementation test", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { a: { ARGS: { ONE: "This message {{test}} required a argument" } } },
    ]);

    createFile(`
      import { Interpreter } from 'language-interpreter';

      const interpreter = new Interpreter({
        localesPath: "${localesDir.replace(/\\/g, "\\\\")}",
        defaultLanguage: 'a'
      });
      console.log(interpreter.translate('ARGS.ONE', { args: { test: 'test' } }));
    `);

    expect(exec()).toBe("This message test required a argument");
  });

  it("should be able translate a message with two arguments using object args in implementation test", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      {
        a: {
          ARGS: {
            TWO: "This message {{test}} required two arguments, {{test2}}",
          },
        },
      },
    ]);

    createFile(`
      import { Interpreter } from 'language-interpreter';

      const interpreter = new Interpreter({
        localesPath: "${localesDir.replace(/\\/g, "\\\\")}",
        defaultLanguage: 'a'
      });
      console.log(interpreter.translate('ARGS.TWO', { args: { test: 'test', test2: 'test2' } }));
    `);

    expect(exec()).toBe("This message test required two arguments, test2");
  });

  it("should be able translate a message with two arguments using array args in implementation test", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      {
        a: {
          ARGS: {
            TWO: "This message {{test}} required two arguments, {{test2}}",
          },
        },
      },
    ]);

    createFile(`
      import { Interpreter } from 'language-interpreter';

      const interpreter = new Interpreter({
        localesPath: "${localesDir.replace(/\\/g, "\\\\")}",
        defaultLanguage: 'a'
      });
      console.log(interpreter.translate('ARGS.TWO', { args: [{ test: 'test' }, { test2: 'test2' }] }));
    `);

    expect(exec()).toBe("This message test required two arguments, test2");
  });

  it("it must be possible to translate into the desired language in implementation test", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([
      { es: { HELLO: "Hola!!!" } },
      { en: { HELLO: "Hello!!!" } },
    ]);

    createFile(`
      import { Interpreter } from 'language-interpreter';

      const interpreter = new Interpreter({
        defaultLanguage: 'en',
        localesPath: "${localesDir.replace(/\\/g, "\\\\")}",
      });
      console.log(interpreter.translate('HELLO', { lang: 'es' }));
    `);

    expect(exec()).toBe("Hola!!!");
  });

  it("must be return a message using the default language when not found desired language", () => {
    const { exec, createLocaleFiles, createFile } = generateEnv({
      module: "cjs",
      returnString: true,
    });

    // Temporary directory for translation files
    const localesDir = createLocaleFiles([{ en: { HELLO: "Hello!!!" } }]);

    createFile(`
      import { Interpreter } from 'language-interpreter';

      const interpreter = new Interpreter({
        defaultLanguage: 'en',
        localesPath: "${localesDir.replace(/\\/g, "\\\\")}",
      });
      console.log(interpreter.translate('HELLO', { lang: 'fr' }));
    `);

    expect(() => exec(false)).not.toThrow();
    expect(exec()).toBe("Hello!!!");
  });
});
