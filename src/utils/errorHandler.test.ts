import { handleApiError, formatErrorMessage, logError } from './errorHandler';

// Mock console.error
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('errorHandler', () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('handleApiError', () => {
    it('should handle network errors', () => {
      const networkError = new Error('Network error');
      const result = handleApiError(networkError);

      expect(result.type).toBe('network');
      expect(result.message).toContain('네트워크 연결');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should handle validation errors', () => {
      const validationError = { status: 400, message: 'Validation failed' };
      const result = handleApiError(validationError);

      expect(result.type).toBe('validation');
      expect(result.message).toContain('입력 데이터');
    });

    it('should handle authentication errors', () => {
      const authError = { status: 401, message: 'Unauthorized' };
      const result = handleApiError(authError);

      expect(result.type).toBe('authentication');
      expect(result.message).toContain('인증이 필요');
    });

    it('should handle server errors', () => {
      const serverError = { status: 500, message: 'Internal server error' };
      const result = handleApiError(serverError);

      expect(result.type).toBe('server');
      expect(result.message).toContain('서버 오류');
    });

    it('should handle unknown errors', () => {
      const unknownError = { status: 999, message: 'Unknown error' };
      const result = handleApiError(unknownError);

      expect(result.type).toBe('unknown');
      expect(result.message).toBe('Unknown error');
    });

    it('should handle string errors', () => {
      const stringError = 'Something went wrong';
      const result = handleApiError(stringError);

      expect(result.type).toBe('unknown');
      expect(result.message).toBe(stringError);
    });
  });

  describe('formatErrorMessage', () => {
    it('should format error messages properly', () => {
      const error = { type: 'validation', message: 'Test error' };
      const formatted = formatErrorMessage(error);

      expect(formatted).toContain('Test error');
      expect(typeof formatted).toBe('string');
    });

    it('should handle undefined errors', () => {
      const formatted = formatErrorMessage(undefined);
      
      expect(formatted).toContain('알 수 없는 오류');
    });

    it('should handle null errors', () => {
      const formatted = formatErrorMessage(null);
      
      expect(formatted).toContain('알 수 없는 오류');
    });
  });

  describe('logError', () => {
    it('should log errors with context', () => {
      const error = new Error('Test error');
      const context = { userId: 1, action: 'test' };

      logError(error, context);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error logged:'),
        expect.objectContaining({
          error: error.message,
          context
        })
      );
    });

    it('should log errors without context', () => {
      const error = new Error('Test error');

      logError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error logged:'),
        expect.objectContaining({
          error: error.message
        })
      );
    });

    it('should handle string errors', () => {
      const error = 'String error';

      logError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error logged:'),
        expect.objectContaining({
          error
        })
      );
    });
  });
});