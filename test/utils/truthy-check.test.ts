import isZeroOrTruthy from '../../src/utils/truthy-check';

describe('isZeroOrTruthy', () => {
  test('should return true for zero', () => {
    expect(isZeroOrTruthy(0)).toBe(true);
  });

  test('should return true for truthy values', () => {
    expect(isZeroOrTruthy(1)).toBe(true);
    expect(isZeroOrTruthy('hello')).toBe(true);
    expect(isZeroOrTruthy(true)).toBe(true);
    expect(isZeroOrTruthy([])).toBe(true);
    expect(isZeroOrTruthy({})).toBe(true);
    expect(isZeroOrTruthy(-1)).toBe(true);
  });

  test('should return false for falsy values (except zero)', () => {
    expect(isZeroOrTruthy(false)).toBe(false);
    expect(isZeroOrTruthy('')).toBe(false);
    expect(isZeroOrTruthy(null)).toBe(false);
    expect(isZeroOrTruthy(undefined)).toBe(false);
    expect(isZeroOrTruthy(NaN)).toBe(false);
  });

  test('should handle edge cases', () => {
    expect(isZeroOrTruthy(0.0)).toBe(true);
    expect(isZeroOrTruthy(-0)).toBe(true);
    expect(isZeroOrTruthy('0')).toBe(true); // string '0' is truthy
  });
});