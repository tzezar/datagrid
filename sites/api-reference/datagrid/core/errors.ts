export class UnableToRenderCellError extends Error {
  constructor(columnId: string) {
    super(
      `Missing custom cell rendering for column: "${columnId}" in your DataGrid.

To fix this, ensure your column definition includes the following Svelte template logic before getCellContent usage:


    {@const cellContent = column.cell ? column.cell({ datagrid, column, row }) : null}
    {#if typeof cellContent === 'string'}
        {@html cellContent}
    {:else if isCellComponent(cellContent)}
        <cellContent.component {datagrid} {row} {column} />
    {/if}

This allows proper rendering for both plain strings and component-based cell content.`
    );
    this.name = 'UnableToRenderCellError';
  }
}