import { calculateColumnWidths, estimateTextWidth, getColumnXOffset } from '../generatePDF';

describe('PDF Utility Functions', () => {
    /**
     * PDF generations tests
     */
    test('calculateColumnWidths should compute correct widths', () => {
        const table = [
        ['A', 'BB', 'CCC'],
        ['DDDD', 'E', 'FFF']
        ];
        const fontSize = 10;
        
        const expectedColumnWidths = [
        estimateTextWidth('DDDD', fontSize), // 4 chars * 10 * 0.6 = 24
        estimateTextWidth('BB', fontSize),   // 2 chars * 10 * 0.6 = 12
        estimateTextWidth('CCC', fontSize)   // 3 chars * 10 * 0.6 = 18
        ];

        const columnWidths = calculateColumnWidths(table, fontSize);

        console.log('Expected Column Widths:', expectedColumnWidths);
        console.log('Received Column Widths:', columnWidths);
        
        expect(columnWidths).toEqual(expectedColumnWidths);
    });

    test('estimateTextWidth should estimate text width correctly', () => {
        const fontSize = 10;
        
        // length * fontSize * 0.6
        expect(estimateTextWidth('A', fontSize)).toBe(6); // 1 char * 10 * 0.6
        expect(estimateTextWidth('BB', fontSize)).toBe(12); // 2 chars * 10 * 0.6
        expect(estimateTextWidth('CCC', fontSize)).toBe(18); // 3 chars * 10 * 0.6
    });

    test('getColumnXOffset should compute correct x offset', () => {
        const columnWidths = [24, 12, 18]; 
        const cellPadding = 10;
        
        expect(getColumnXOffset(0, columnWidths, cellPadding)).toBe(0); // First column
        expect(getColumnXOffset(1, columnWidths, cellPadding)).toBe(34); // Second column (24 + 10)
        expect(getColumnXOffset(2, columnWidths, cellPadding)).toBe(56); // Third column (24 + 12 + 10)
    });
});
