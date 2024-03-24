import { PDFDocument, rgb } from 'pdf-lib';

 async function generatePDF(cartItems) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const tableX = 25;
  const cellPadding = 10;
  let tableY = height - 100;

  const currentDate = new Date();
  const nextMonday = new Date(currentDate);
  nextMonday.setDate(currentDate.getDate() + (1 + 7 - currentDate.getDay()) % 7); 

  const nextSaturday = new Date(nextMonday);
  nextSaturday.setDate(nextMonday.getDate() + 5); 

  const startDateString = nextMonday.toLocaleDateString('de-DE');
  const endDateString = nextSaturday.toLocaleDateString('de-DE');

  const titleText = `Bestellung für: ${startDateString} bis ${endDateString}`;

  const titleY = height - 50;
  page.drawText(titleText, { x: tableX, y: titleY, size: 16 });

  const tableData = [
    ['Artikel', 'Datum', 'Menge', 'Einzelpreis'],
    ...cartItems.map(item => [
      item.Name || '', 
      item.date || '', 
      String(item.quantity || ''), 
      `${item.price || ''} €`
    ])
  ];

  const drawTable = (table, startX, startY, cellPadding) => {
    const fontSize = 10;
    const lineHeight = fontSize + cellPadding * 2;
    const columnWidths = calculateColumnWidths(table, fontSize);
    let y;
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      for (let j = 0; j < row.length; j++) {
        const text = row[j] || ''; // Überprüfung auf undefined und Zuweisung eines leeren Strings
        const x = startX + getColumnXOffset(j, columnWidths, cellPadding);
        y = startY - i * lineHeight - cellPadding;
        page.drawText(text, { x, y, size: fontSize });
      }
    }
    return y - 30;
  };

  const calculateColumnWidths = (table, fontSize) => {
    const columnWidths = Array(table[0].length).fill(0);
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      for (let j = 0; j < row.length; j++) {
        const textWidth = estimateTextWidth(row[j], fontSize);
        columnWidths[j] = Math.max(columnWidths[j], textWidth);
      }
    }
    return columnWidths;
  };

  const estimateTextWidth = (text, fontSize) => {
    return text.length * fontSize * 0.6; // Schätzungsformel
  };

  const getColumnXOffset = (columnIndex, columnWidths, cellPadding) => {
    let offset = 0;
    for (let i = 0; i < columnIndex; i++) {
      offset += columnWidths[i];
    }
    offset += columnIndex * cellPadding;
    return offset;
  };

  const y = drawTable(tableData, tableX, tableY, cellPadding);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  page.drawText(`Gesamtpreis: ${totalPrice.toFixed(2)} €`, { x: tableX, y, size: 14 });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
export default generatePDF;