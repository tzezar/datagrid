/**
 * Gets the height of the head element identified by the provided identifier.
 *
 * @param {string} identifier - The identifier to select the head element.
 * @returns {number} - The height of the head element, or a default value if not found.
 */
export const getHeadSize = (identifier: string): number => {
    const head = document.querySelector<HTMLElement>(`[data-datagrid-head="${identifier}"]`);

    if (!head) {
        console.warn(`Head not found for identifier: ${identifier}`);
        return DEFAULT_HEAD_HEIGHT; // Use a constant for default height
    }

    return head.clientHeight;
};

// Constant for the default head height
const DEFAULT_HEAD_HEIGHT = 20;
