import a from './a';
export * as a from './a';

import b from './b';
export * as b from './b';

import en from './en';
export * as en from './en';

import es from './es';
export * as es from './es';

import pt_br from './pt-br';
export * as pt_br from './pt-br';


/**
 * Types to represent the JSON structures of the files
 */
export type JsonTypes = A | B | En | Es | Pt_Br;

/**
 * Types to represent the JSON files
 */
export type JsonFilesType = "a" | "b" | "en" | "es" | "pt-br";
