import { LogConfig } from "./log-config.interface";
import { FileStructureConfig } from "./file-structure-config.interface";


export type Config = FileStructureConfig & LogConfig;

export interface BaseConfig {
    basePath: string;
    defaultLanguage?: string;
}
