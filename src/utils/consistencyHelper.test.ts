import {
  calculateConsistencyRatio,
  getConsistencyColor,
  getConsistencyLevel,
  getConsistencyAdvice,
  isMatrixConsistent
} from './consistencyHelper';

describe('consistencyHelper', () => {
  describe('calculateConsistencyRatio', () => {
    it('should calculate CR for a 3x3 matrix', () => {
      const matrix = [
        [1, 2, 3],
        [0.5, 1, 2],
        [0.33, 0.5, 1]
      ];
      
      const cr = calculateConsistencyRatio(matrix);
      
      expect(cr).toBeGreaterThanOrEqual(0);
      expect(cr).toBeLessThan(1);
    });

    it('should return 0 for perfectly consistent 2x2 matrix', () => {
      const matrix = [
        [1, 2],
        [0.5, 1]
      ];
      
      const cr = calculateConsistencyRatio(matrix);
      
      expect(cr).toBe(0);
    });

    it('should handle identity matrix', () => {
      const matrix = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ];
      
      const cr = calculateConsistencyRatio(matrix);
      
      expect(cr).toBeGreaterThanOrEqual(0);
    });

    it('should handle single element matrix', () => {
      const matrix = [[1]];
      
      const cr = calculateConsistencyRatio(matrix);
      
      expect(cr).toBe(0);
    });
  });

  describe('getConsistencyLevel', () => {
    it('should return correct consistency levels', () => {
      expect(getConsistencyLevel(0.03)).toBe('Excellent');
      expect(getConsistencyLevel(0.07)).toBe('Good');
      expect(getConsistencyLevel(0.09)).toBe('Acceptable');
      expect(getConsistencyLevel(0.15)).toBe('Poor');
    });

    it('should handle boundary values', () => {
      expect(getConsistencyLevel(0.05)).toBe('Excellent');
      expect(getConsistencyLevel(0.08)).toBe('Good');
      expect(getConsistencyLevel(0.10)).toBe('Acceptable');
      expect(getConsistencyLevel(0.11)).toBe('Poor');
    });

    it('should handle zero and negative values', () => {
      expect(getConsistencyLevel(0)).toBe('Excellent');
      expect(getConsistencyLevel(-0.01)).toBe('Excellent');
    });
  });

  describe('getConsistencyColor', () => {
    it('should return correct colors for consistency levels', () => {
      expect(getConsistencyColor(0.03)).toBe('green');
      expect(getConsistencyColor(0.07)).toBe('blue');
      expect(getConsistencyColor(0.09)).toBe('yellow');
      expect(getConsistencyColor(0.15)).toBe('red');
    });

    it('should handle boundary values correctly', () => {
      expect(getConsistencyColor(0.05)).toBe('green');
      expect(getConsistencyColor(0.08)).toBe('blue');
      expect(getConsistencyColor(0.10)).toBe('yellow');
      expect(getConsistencyColor(0.11)).toBe('red');
    });
  });

  describe('getConsistencyAdvice', () => {
    it('should provide appropriate advice for different CR levels', () => {
      const excellentAdvice = getConsistencyAdvice(0.03);
      expect(excellentAdvice).toContain('일관성이 매우 우수합니다');

      const goodAdvice = getConsistencyAdvice(0.07);
      expect(goodAdvice).toContain('일관성이 좋습니다');

      const acceptableAdvice = getConsistencyAdvice(0.09);
      expect(acceptableAdvice).toContain('허용 가능한 수준');

      const poorAdvice = getConsistencyAdvice(0.15);
      expect(poorAdvice).toContain('재검토가 필요');
    });

    it('should handle extreme values', () => {
      const zeroAdvice = getConsistencyAdvice(0);
      expect(zeroAdvice).toContain('일관성이 매우 우수합니다');

      const highAdvice = getConsistencyAdvice(1.0);
      expect(highAdvice).toContain('재검토가 필요');
    });
  });

  describe('isMatrixConsistent', () => {
    it('should return true for consistent matrices', () => {
      expect(isMatrixConsistent(0.05)).toBe(true);
      expect(isMatrixConsistent(0.08)).toBe(true);
      expect(isMatrixConsistent(0.10)).toBe(true);
    });

    it('should return false for inconsistent matrices', () => {
      expect(isMatrixConsistent(0.11)).toBe(false);
      expect(isMatrixConsistent(0.15)).toBe(false);
      expect(isMatrixConsistent(0.20)).toBe(false);
    });

    it('should handle boundary case exactly', () => {
      expect(isMatrixConsistent(0.10)).toBe(true);
      expect(isMatrixConsistent(0.100001)).toBe(false);
    });

    it('should handle negative values', () => {
      expect(isMatrixConsistent(-0.01)).toBe(true);
    });
  });
});