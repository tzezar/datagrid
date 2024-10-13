import { XMLBuilder } from 'fast-xml-parser';
import type { BaseColumn } from '../types';

/**
 * Exports data to an XML file using the specified columns.
 *
 * This function converts the provided data array into an XML format based on the specified columns
 * and triggers a download of the generated XML file.
 *
 * @param {T[]} data - The array of data objects to be exported.
 * @param {BaseColumn<T>[]} columns - The array of column definitions that include the id and other properties.
 * @template T - The type of data items being processed.
 */
export const exportToXML = <T>(data: T[], columns: BaseColumn<T>[]): void => {
  // Initialize XML builder with specified options
  const builder = new XMLBuilder({
    ignoreAttributes: false, // Include attributes in XML
    format: true,            // Format the XML output
    indentBy: '  '          // Indentation for pretty-printing
  });

  // Convert data to XML format
  const rows = data.map(row => {
    const rowData: Record<string, unknown> = {}; // Initialize an object for row data
    columns.forEach(column => {
      // Safely assign each column value to the row data
      rowData[column.id as string] = row[column.id as keyof T]; // Use type assertion to ensure the key exists on row
    });
    return rowData; // Return the constructed row data object
  });

  // Build the XML structure
  const xml = builder.build({ rows: { row: rows } });

  // Create a Blob with the XML data
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) { // Feature detection
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.xml'); // Default filename
    link.style.visibility = 'hidden'; // Hide the link
    document.body.appendChild(link); // Append to the document
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up
  } else {
    console.error('Download not supported in this browser.'); // Error handling
  }
};
