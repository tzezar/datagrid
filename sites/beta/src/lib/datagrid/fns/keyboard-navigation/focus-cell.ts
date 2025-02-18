export const focusCell = ({
    rowIndex,
    columnIndex,
    identifier
}: {
    rowIndex: number;
    columnIndex: number;
    identifier: string;
}) => {
    const cell = document.querySelector(
        `[data-row="${rowIndex}"][data-column="${columnIndex}"]`
    ) as HTMLElement | null;

    if (!cell) return;

    const focusableChild = cell.querySelector(
        'input, button, [tabindex="0"]'
    ) as HTMLElement | null;

    cell.focus();

    // Ensure the cell is visible by scrolling the parent table
    cell.scrollIntoView({
        behavior: 'smooth', // Smooth scrolling for better UX
        block: 'nearest', // Scroll vertically if needed
        inline: 'nearest' // Scroll horizontally if needed
    });

    const header = document.querySelector(
        `[data-datagrid-head-identifier="${identifier}"]`
    ) as HTMLElement | null;
    const footer = document.querySelector(
        `[data-datagrid-footer-identifier="${identifier}"]`
    ) as HTMLElement | null;
    const container = document.querySelector(
        `[data-datagrid-identifier="${identifier}"]`
    ) as HTMLElement | null;

    if (!container) {
        console.log('Container identifier was not provided');
        return;
    }
    if (!header) {
        console.log('Header identifier was not provided');
        return;
    }
    if (!footer) {
        console.log('Footer identifier was not provided');
        return;
    }

    const cellRect = cell.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const headerHeight = header.clientHeight;
    const footerHeight = footer.clientHeight;

    // Adjust scroll position to account for the sticky header
    if (cellRect.top < containerRect.top + headerHeight) {
        container.scrollTop -= (containerRect.top + headerHeight - cellRect.top) + 20;
    }

    // Adjust scroll position to account for the sticky footer
    if (cellRect.bottom > containerRect.bottom - footerHeight) {
        container.scrollTop += (cellRect.bottom - containerRect.bottom + footerHeight) + 20;
    }

    // Handle Enter and Escape keys
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && focusableChild) {
            focusableChild.focus();
            event.stopPropagation(); // Prevent event from reaching parent
        } else if (event.key === 'Escape') {
            cell.focus();
            event.stopPropagation(); // Prevent event from reaching parent
        }
    };

    cell.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when cell loses focus
    cell.addEventListener('blur', () => {
        cell.removeEventListener('keydown', handleKeyDown);
    });
};
