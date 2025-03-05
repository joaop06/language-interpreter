/**
 * Types to represent the JSON structures of the files
 */
export type JsonTypes = En | Es | Example | Example2;

export type JsonFilesType = "en" | "es" | "example" | "example2";

/**
 * Structures of each JSON file represented in a specific type
 * @see En
 * @see Es
 * @see Example
 * @see Example2
 */

export type En = {
  HELLO: string;
};
export type Es = {
  HELLO: string;
};
export type Example = {
  key: string;
  key2: string;
};
export type Example2 = {
  key3: string;
  key4: string;
};
