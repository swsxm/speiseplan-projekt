import { validateLength, validateNumber, validateFloat, validateEmail, validateUrl } from '../validationHelpers';

/**
 * Tests for Input validation
 */
describe('Validation and MongoDB Connection Tests', () => {
  describe('validateLength', () => {
    test('should return null for valid length', () => {
      expect(validateLength('Valid', 1, 10)).toBeNull();
    });

    test('should return error for length less than minimum', () => {
      expect(validateLength('Short', 10, 20)).toBe('Must be between 10 and 20 characters long.');
    });

    test('should return error for length more than maximum', () => {
      expect(validateLength('This is too long', 1, 10)).toBe('Must be between 1 and 10 characters long.');
    });

    test('should return null for length exactly equal to minimum', () => {
      expect(validateLength('ExactMin', 8, 10)).toBeNull();
    });

    test('should return null for length exactly equal to maximum', () => {
      expect(validateLength('ExactMax', 1, 8)).toBeNull();
    });
  });

  // Tests for validateNumber
  describe('validateNumber', () => {
    test('should return null for valid number', () => {
      expect(validateNumber('12345', 1, 10)).toBeNull();
    });

    test('should return error for non-numeric value', () => {
      expect(validateNumber('abc', 1, 10)).toBe('The ID must be a number.');
    });

    test('should return error for number with length less than minimum', () => {
      expect(validateNumber('1', 2, 10)).toBe('ID Must be between 2 and 10 characters long.');
    });

    test('should return error for number with length more than maximum', () => {
      expect(validateNumber('12345678901', 1, 10)).toBe('ID Must be between 1 and 10 characters long.');
    });

    test('should return null for number with exact minimum and maximum length', () => {
      expect(validateNumber('123', 3, 3)).toBeNull();
    });
  });

  // Tests for validateFloat
  describe('validateFloat', () => {
    test('should return null for valid float', () => {
      expect(validateFloat('123.45', 1, 10)).toBeNull();
    });

    test('should return error for non-numeric value', () => {
      expect(validateFloat('abc', 1, 10)).toBe('The value must be a positive floating-point number.');
    });

    test('should return error for value with length less than minimum', () => {
      expect(validateFloat('1', 2, 10)).toBe('Value Must be between 2 and 10 characters long.');
    });

    test('should return error for value with length more than maximum', () => {
      expect(validateFloat('12345678901.123', 1, 10)).toBe('Value Must be between 1 and 10 characters long.');
    });

    test('should return error for invalid float format', () => {
      expect(validateFloat('123..45', 1, 10)).toBe('The value must be a positive floating-point number.');
    });
  });

  // Tests for validateEmail
  describe('validateEmail', () => {
    test('should return null for valid email', () => {
      expect(validateEmail('test@example.com')).toBeNull();
    });

    test('should return error for email with invalid format', () => {
      expect(validateEmail('invalid-email')).toBe('The email address is invalid.');
    });

    test('should return error for email with length less than minimum', () => {
      expect(validateEmail('a@b.c')).toBe('The email address is invalid.');
    });

    test('should return error for email with length more than maximum', () => {
      expect(validateEmail('a'.repeat(256) + '@example.com')).toBe('Email Must be between 5 and 255 characters long.');
    });

    test('should return null for email with exact length of minimum', () => {
      expect(validateEmail('a@b.co')).toBeNull();
    });
  });

  // Tests for validateUrl
  describe('validateUrl', () => {
    test('should return null for valid URL', () => {
      expect(validateUrl('https://example.com')).toBeNull();
    });

    test('should return error for invalid URL', () => {
      expect(validateUrl('invalid-url')).toBe('URL is not valid: invalid-url');
    });

    test('should return null for URL with query parameters', () => {
      expect(validateUrl('https://example.com?query=1')).toBeNull();
    });

    test('should return null for URL with fragment', () => {
      expect(validateUrl('https://example.com#section')).toBeNull();
    });

    test('should return error for URL with unsupported protocol', () => {
      expect(validateUrl('asdf://example.com')).toBe('URL must start with http:// or https://');
    });
  });
});
