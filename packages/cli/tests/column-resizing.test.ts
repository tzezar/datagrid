import { describe, expect, it } from 'vitest';

import {
  clampColumnWidth,
  getDraggedColumnWidth,
  getKeyboardColumnWidth,
} from '../datagrid-enhanced/core/features/column-resizing.svelte';

const constraints = { minWidth: 80, maxWidth: 240 };

describe('column resizing', () => {
  it('calculates a dragged width from the initial pointer position', () => {
    expect(getDraggedColumnWidth(120, 200, 245, constraints)).toBe(165);
    expect(getDraggedColumnWidth(120, 200, 170, constraints)).toBe(90);
  });

  it('clamps dragged widths to the configured limits', () => {
    expect(getDraggedColumnWidth(120, 200, 100, constraints)).toBe(80);
    expect(getDraggedColumnWidth(120, 200, 400, constraints)).toBe(240);
    expect(clampColumnWidth(160, constraints)).toBe(160);
  });

  it('resizes with arrow keys while preserving limits', () => {
    expect(getKeyboardColumnWidth(120, 'ArrowLeft', constraints)).toBe(110);
    expect(getKeyboardColumnWidth(120, 'ArrowRight', constraints)).toBe(130);
    expect(getKeyboardColumnWidth(80, 'ArrowLeft', constraints)).toBe(80);
    expect(getKeyboardColumnWidth(240, 'ArrowRight', constraints)).toBe(240);
  });

  it('ignores unrelated keys', () => {
    expect(getKeyboardColumnWidth(120, 'Enter', constraints)).toBe(120);
  });
});
