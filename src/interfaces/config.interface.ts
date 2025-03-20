export type Config = BaseConfig;

interface BaseConfig {
  localesPath: string;
  defaultLanguage: string;
  exportTypeDeclaration?: boolean;
}
