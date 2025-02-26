import { join } from 'path';
import { existsSync, readdirSync } from 'fs';
import { it, expect, describe } from 'vitest';
import { generateTypes } from '../../src/interpreter';

describe('generateTypes', () => {


    it('must create the types based on the JSON files', () => {
        const dir = __dirname + '/locales';

        generateTypes(dir);

        const recursiveFiles = (dir: string): void => {
            readdirSync(dir, { withFileTypes: true }).forEach(entry => {
                const entryPath = join(dir, entry.name);
                const isDirectory = entry.isDirectory();

                if (isDirectory || entry.name.endsWith('.d.ts')) {
                    if (isDirectory) recursiveFiles(entryPath);
                    else expect(existsSync(entryPath)).toBe(true);
                }
            });
        }

        recursiveFiles(dir);
    });
});