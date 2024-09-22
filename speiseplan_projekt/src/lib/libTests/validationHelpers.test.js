import { validateLength, validateNumber, validateFloat, validateEmail, validateUrl, validateDate, showError, getNextSundayMidnight } from '../validationHelpers';

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

  describe('validateDate', () => {
    it('should return false if the date is in the past', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1); // One day in the past
        expect(validateDate(pastDate.toISOString())).toBe(false);
    });

    it('should return false if the date is after Thursday 6pm of this week', () => {
        const thursday = new Date();
        thursday.setDate(thursday.getDate() + (4 - thursday.getDay())); // Get this Thursday
        thursday.setHours(19, 0, 0, 0); // 7pm (after 6pm)
        expect(validateDate(thursday.toISOString())).toBe(false);
    });

    it('should return false if the date is within the current week', () => {
        const now = new Date();
        const thisWeekDate = new Date(now.setDate(now.getDate() + (6 - now.getDay()))); // Get a day in the current week
        expect(validateDate(thisWeekDate.toISOString())).toBe(false);
    });

    it('should return true for a valid date outside the constraints', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10); // 10 days in the future
        expect(validateDate(futureDate.toISOString())).toBe(true);
    });
  });

  describe('showError', () => {
    let createElementSpy;
    let appendChildSpy;
    let popupMock;

    beforeEach(() => {
        // Mock document.createElement
        popupMock = {
            style: {},
            remove: jest.fn(),
        };
        createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(popupMock);
        appendChildSpy = jest.spyOn(document.body, 'appendChild');
    });

    afterEach(() => {
        // Restore mocks
        jest.restoreAllMocks();
    });

    it('should return null for response status 2xx', () => {
        const response = { status: 200 };
        expect(showError(response)).toBeNull();
    });
  });

  describe('getNextSundayMidnight', () => {
    it('should return the correct next Sunday at midnight', () => {

        const thursday = new Date('2024-09-19T12:00:00'); 


        const result = getNextSundayMidnight(thursday);

        const expectedSunday = new Date('2024-09-22T00:00:00'); 
        expect(result.getTime()).toBe(expectedSunday.getTime());
    });
    
    it('should return next Sunday if input is a Monday', () => {
       
        const monday = new Date('2024-09-16T10:00:00'); 

       
        const result = getNextSundayMidnight(monday);

        const expectedSunday = new Date('2024-09-22T00:00:00');
        expect(result.getTime()).toBe(expectedSunday.getTime());
    });
  });
});
