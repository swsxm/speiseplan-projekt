import { calenderWeek, dayOfWeek, dayNameToNumber } from '../datetimeHelpers';

describe('Date Helper Functions', () => {
  describe('calenderWeek', () => {
    /**
     * Tests for calender Week calculation
     */
    it('should return the correct calendar week number for January 15, 2024', () => {
      const testDate = new Date('2024-01-15');
      expect(calenderWeek(testDate)).toBe(3); 
    });

    it('should return the correct calendar week number for December 31, 2023', () => {
      const testDate = new Date('2023-12-31');
      expect(calenderWeek(testDate)).toBe(53); 
    });

    it('should return the correct calendar week number for January 1, 2024', () => {
      const testDate = new Date('2024-01-01');
      expect(calenderWeek(testDate)).toBe(1); 
    });

    it('should return the correct calendar week number for a leap year February 29, 2024', () => {
      const testDate = new Date('2024-02-29');
      expect(calenderWeek(testDate)).toBe(9); 
    });
  });

  describe('dayOfWeek', () => {
    /**
     * Test to calculate the day of the Week
     */
    it('should return 0 for Sunday', () => {
      const testDate = new Date('2024-01-14');
      expect(dayOfWeek(testDate)).toBe(0); 
    });

    it('should return 6 for Saturday', () => {
      const testDate = new Date('2024-01-20');
      expect(dayOfWeek(testDate)).toBe(6); 
    });

    it('should return 1 for Monday', () => {
      const testDate = new Date('2024-01-15');
      expect(dayOfWeek(testDate)).toBe(1); 
    });

    it('should return 5 for Friday', () => {
      const testDate = new Date('2024-01-19'); 
      expect(dayOfWeek(testDate)).toBe(5); 
    });

    it('should handle dates from different months correctly', () => {
      const testDate = new Date('2024-02-29'); 
      expect(dayOfWeek(testDate)).toBe(4); 
    });
  });
  describe('dayNameToNumber Mapping', () => {
    test('should map "Montag" to 1', () => {
      expect(dayNameToNumber["Montag"]).toBe(1);
    });
  
    test('should map "Dienstag" to 2', () => {
      expect(dayNameToNumber["Dienstag"]).toBe(2);
    });
  
    test('should map "Mittwoch" to 3', () => {
      expect(dayNameToNumber["Mittwoch"]).toBe(3);
    });
  
    test('should map "Donnerstag" to 4', () => {
      expect(dayNameToNumber["Donnerstag"]).toBe(4);
    });
  
    test('should map "Freitag" to 5', () => {
      expect(dayNameToNumber["Freitag"]).toBe(5);
    });
  
    test('should map "Samstag" to 6', () => {
      expect(dayNameToNumber["Samstag"]).toBe(6);
    });
  
    test('should map "Sonntag" to 7', () => {
      expect(dayNameToNumber["Sonntag"]).toBe(7);
    });
  
    test('should return undefined for invalid day names', () => {
      expect(dayNameToNumber["InvalidDay"]).toBeUndefined();
    });
  });
});
