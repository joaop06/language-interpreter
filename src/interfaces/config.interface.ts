import { Locales } from "../types/locales";
import { OrganizingFiles } from "../types/organizing-files.type";

export interface Config {
    locales: Locales;
    basePath: string;
    organizingFiles: OrganizingFiles;
}