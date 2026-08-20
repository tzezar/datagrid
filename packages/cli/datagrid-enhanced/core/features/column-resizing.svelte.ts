
export type ColumnSizingEnhancedPluginConfig = {
    columnResizeMode?: 'standard' | 'fluid';
}

type ColumnWidthConstraints = {
    minWidth: number;
    maxWidth: number;
}

export function clampColumnWidth(width: number, constraints: ColumnWidthConstraints): number {
    return Math.max(constraints.minWidth, Math.min(width, constraints.maxWidth));
}

export function getDraggedColumnWidth(
    startWidth: number,
    startClientX: number,
    currentClientX: number,
    constraints: ColumnWidthConstraints,
): number {
    return clampColumnWidth(startWidth + currentClientX - startClientX, constraints);
}

export function getKeyboardColumnWidth(
    currentWidth: number,
    key: string,
    constraints: ColumnWidthConstraints,
    step = 10,
): number {
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return currentWidth;

    const direction = key === 'ArrowLeft' ? -1 : 1;
    return clampColumnWidth(currentWidth + direction * step, constraints);
}

export class ColumnSizingEnhancedFeature {

    columnResizeMode: 'standard' | 'fluid' = $state('standard') // fluid changes width on mouse move

    onColumnResize: (columnId: string, width: number) => void = () => { };

    constructor(config?: ColumnSizingEnhancedPluginConfig) {
        Object.assign(this, config)

    }


}
