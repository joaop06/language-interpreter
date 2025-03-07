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
 * Type to group the types of JSON files
 */
export type LanguagesTypes = a | b | en | es | pt_br;

/**
 * Types to represent the names of JSON files
 */
export type LanguageNamesTypes = "a" | "b" | "en" | "es" | "pt-br";