import fs from "fs";
import { Logger } from "./logger";
import {
  it,
  vi,
  expect,
  describe,
  afterEach,
  beforeEach,
  MockInstance,
} from "vitest";

describe("Logger", () => {
  let consoleLogSpy: MockInstance;
  let consoleInfoSpy: MockInstance;
  let consoleWarnSpy: MockInstance;
  let consoleErrorSpy: MockInstance;
  let consoleDebugSpy: MockInstance;
  let appendFileSyncSpy: MockInstance;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    appendFileSyncSpy = vi
      .spyOn(fs, "appendFileSync")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a Logger instance", () => {
    const logger = new Logger();
    expect(logger.id).toBeUndefined();
    expect(logger).toBeInstanceOf(Logger);
  });

  it("should instantiate the logger with an ID", () => {
    const logger = new Logger("Test");
    expect(logger.id).toBe("Test");
  });

  it("should allow setting a new ID", () => {
    const logger = new Logger();
    logger.id = "NewID";
    expect(logger.id).toBe("NewID");
  });

  it("should print a log message with ID", () => {
    const logger = new Logger("LoggerTest");
    logger.log("Test message");
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it("should print a log message without ID", () => {
    const logger = new Logger();
    logger.log("Test message");
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it("should log an info message", () => {
    const logger = new Logger("InfoLogger");
    logger.info("Test info message");
    expect(consoleInfoSpy).toHaveBeenCalled();
  });

  it("should log a warning message", () => {
    const logger = new Logger("WarnLogger");
    logger.warn("Test warning message");
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it("should log an error message", () => {
    const logger = new Logger("ErrorLogger");
    logger.error("Test error message");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should log a debug message when DEBUG is enabled", () => {
    process.env.DEBUG = "true";
    const logger = new Logger("DebugLogger");
    logger.debug("Test debug message");
    expect(consoleDebugSpy).toHaveBeenCalled();
    delete process.env.DEBUG;
  });

  it("should not log a debug message when DEBUG is disabled", () => {
    process.env.DEBUG = "false";
    const logger = new Logger("DebugLogger");
    logger.debug("Test debug message");
    expect(consoleDebugSpy).not.toHaveBeenCalled();
    delete process.env.DEBUG;
  });

  it("should save logs to a file if logFilePath is set", () => {
    const logger = new Logger("FileLogger", "test.log");
    logger.log("Test file log");
    expect(appendFileSyncSpy).toHaveBeenCalled();
  });

  it("should save error logs to a file if logFilePath is set", () => {
    const logger = new Logger("FileErrorLogger", "test.log");
    logger.error("Test file error");
    expect(appendFileSyncSpy).toHaveBeenCalled();
  });

  it("should not save logs to a file if logFilePath is not set", () => {
    const logger = new Logger();
    logger.log("Test without file");
    expect(appendFileSyncSpy).not.toHaveBeenCalled();
  });
});
