import { getContext } from "svelte";
import { TzezarDatagrid } from "../tzezar-datagrid.svelte";

/** @type {import('svelte/action').Action}  */
export function edgeScrolling(container: HTMLElement) {
    const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
    const initialScrollAmount = 10; // Initial amount to scroll (in pixels)
    const maxScrollAmount = 300; // Maximum scroll amount (in pixels)
    const edgeThreshold = 30; // Distance from the edge to start scrolling (in pixels)
    const acceleration = 0.02; // Acceleration factor for scrolling speed

    let scrollAmount = initialScrollAmount;
    let scrollInterval: NodeJS.Timeout | null = null;

    function handleMouseMove(event: MouseEvent) {


        const datagridContainer = document.querySelector(`[data-datagrid-identifier="${datagrid.identifier}"]`) as HTMLElement | null;
        if (!datagridContainer) {
            console.log('Container identifier was not provided');
            return;
        }


        const { clientX, clientY } = event;
        const { left, right, top, bottom } = container.getBoundingClientRect();

        // Determine direction of scrolling
        let scrollHorizontal = 0;
        let scrollVertical = 0;

        // Scroll horizontally
        if (clientX < left + edgeThreshold) {
            scrollHorizontal = -scrollAmount;
        } else if (clientX > right - edgeThreshold) {
            scrollHorizontal = scrollAmount;
        }

        // Scroll vertically
        if (clientY < top + edgeThreshold) {
            scrollVertical = -scrollAmount;
        } else if (clientY > bottom - edgeThreshold) {
            scrollVertical = scrollAmount;
        }

        // If we are scrolling in any direction, start or update the interval
        if (scrollHorizontal !== 0 || scrollVertical !== 0) {
            if (scrollInterval) {
                clearInterval(scrollInterval);
            }

            scrollInterval = setInterval(() => {
                datagridContainer.scrollLeft += scrollHorizontal;
                datagridContainer.scrollTop += scrollVertical;
                // Increase scroll amount up to a maximum limit
                scrollAmount = Math.min(scrollAmount + acceleration, maxScrollAmount);
            }, 20); // Interval in milliseconds

        } else {
            // Stop scrolling when cursor is not near the edge
            if (scrollInterval) {
                clearInterval(scrollInterval);
                scrollInterval = null;
                scrollAmount = initialScrollAmount; // Reset scroll amount
            }
        }
    }

    container.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove the event listener
    return {
        destroy() {
            if (scrollInterval) {
                clearInterval(scrollInterval);
            }
            container.removeEventListener('mousemove', handleMouseMove);
        }
    };
}
