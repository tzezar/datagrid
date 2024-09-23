import { XMLBuilder } from 'fast-xml-parser';
import type { BaseColumn } from '../types';


// Function to convert data to XML
export const exportToXML = <T>(data: T[], columns: BaseColumn<T>[]) => {
  // Initialize XML builder
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    indentBy: '  '
  });

  // Convert data to XML format
  const rows = data.map(row => {
    const rowData: Record<string, unknown> = {};
    columns.forEach(column => {
      // Use type assertion to ensure the key exists on row
      rowData[column.id as string] = row[column.id as keyof T];
    });
    return rowData;
  });

  const xml = builder.build({ rows: { row: rows } });

  // Create a Blob with the XML data
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) { // Feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.xml');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
