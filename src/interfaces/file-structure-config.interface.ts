import { BaseConfig } from "./config.interface";

export type FileStructureConfig = AutomaticFileStructure | ManualFileStructure;

interface AutomaticFileStructure extends BaseConfig {
    fileStructure?: 'automatic';
    fileStructureConfig?: never; // Evita que `fileStructureConfig` seja informado erroneamente
}

interface ManualFileStructure extends BaseConfig {
    fileStructure: 'manual';
    fileStructureConfig: {
        manualSetting1: string;
        manualSetting2: number;
    };
}
