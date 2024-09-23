export const getHeadSize = (identifier: string) => {
    const head = document.querySelector(
        `[data-datagrid-head="${identifier}"]`
    ) as HTMLElement | null;
    if (!head) console.log('Head not found');

    return head?.clientHeight || 20;
};