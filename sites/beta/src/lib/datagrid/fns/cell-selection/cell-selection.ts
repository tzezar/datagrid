import type { SelectionState } from "../../types";
import { handleMouseDown } from "./handle-mouse-down";
import { handleMouseMove } from "./handle-mouse-move.svelte";
import { handleMouseUp } from "./handle-mouse-up";

/** @type {import('svelte/action').Action}  */
export function cellSelection(node: HTMLElement, {
    enabled = true,
    columnIndex,
    rowIndex,
    selectionState
}: {
    enabled: boolean,
    columnIndex: number,
    rowIndex: number,
    selectionState: SelectionState
}) {
    const down = (e: MouseEvent) => {
        handleMouseDown({
            e,
            columnIndex,
            rowIndex,
            selectionState
        })
    }
    const up = (e: MouseEvent) => {
        handleMouseUp({
            e,
            columnIndex,
            rowIndex,
            selectionState
        })
    
    }
    const move = () => {
        handleMouseMove({
            columnIndex,
            rowIndex,
            selectionState
        })
        // focusCell({
        //     rowIndex, columnIndex, identifier: datagrid.identifier
        // })
    }



    if (enabled) {
        node.addEventListener('mousedown', down);

        node.addEventListener('mouseup', up);

        node.addEventListener('mousemove', move);
    }

    return {
        destroy() {
            if (enabled) {
                node.removeEventListener('mousedown', down);
                node.removeEventListener('mouseup', up);
                node.removeEventListener('mousemove', move);
            }
        }
    }
}