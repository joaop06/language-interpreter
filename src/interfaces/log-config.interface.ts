import { BaseConfig } from "./config.interface";

export type LogConfig = DebugLogConfig | OtherLogConfig;

interface OtherLogConfig extends BaseConfig {
    logLevel?: 'info' | 'error';
    logConfig?: never; // Impede `logConfig` se o nível não for 'debug'
}

interface DebugLogConfig extends BaseConfig {
    logLevel: 'debug';
    logConfig: {
        logPath: string;
        logRetentionDays: number;
    };
}
