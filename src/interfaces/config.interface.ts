export type Config = BaseConfig & (DebugLogConfig | OtherLogConfig);

interface BaseConfig {
  localesPath: string;
  defaultLanguage?: string;
}

interface OtherLogConfig extends BaseConfig {
  logLevel?: "info" | "error";
  logConfig?: never; // Impede `logConfig` se o nível não for 'debug'
}

interface DebugLogConfig extends BaseConfig {
  logLevel: "debug";
  logConfig: {
    logPath: string;
    logRetentionDays: number;
  };
}
