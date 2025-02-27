import { Exception } from './exception';
import { Logger } from '../helper/logger';
import { it, expect, describe, vi } from 'vitest';

describe('Exception', () => {
    it('should be an instance of Exception and Error', () => {
        const exception = new Exception('Test Message');

        expect(exception).toBeInstanceOf(Error);
        expect(exception).toBeInstanceOf(Exception);
    });

    it('should properly set message and cause', () => {
        const exception = new Exception('Test Message', 'Test Cause');

        expect(exception.message).toBe('Test Message');
        expect(exception.cause).toBe('Test Cause');
        expect(exception.name).toBe('Exception');
    });

    it('should include stack trace', () => {
        const exception = new Exception('Test Message');
        expect(exception.stack).toBeDefined();
    });

    it('should throw an Exception when explicitly thrown', () => {
        expect(() => { throw new Exception('Test Message', 'Test Cause'); })
            .toThrow(Exception);
        expect(() => { throw new Exception('Test Message', 'Test Cause'); })
            .toThrow('Test Message');
    });

    it('should log the error message when instantiated', () => {
        const loggerSpy = vi.spyOn(Logger.prototype, 'error');
        new Exception('Logged Error', 'Some Cause');

        expect(loggerSpy).toHaveBeenCalledWith('Exception: Logged Error | Cause: Some Cause');
        loggerSpy.mockRestore();
    });

    it('should log error message without cause', () => {
        const loggerSpy = vi.spyOn(Logger.prototype, 'error');
        new Exception('Logged Error');

        expect(loggerSpy).toHaveBeenCalledWith('Exception: Logged Error');
        loggerSpy.mockRestore();
    });
});
