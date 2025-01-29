import type { TzezarsDatagrid } from "../index.svelte";
import { StylingFeature, type StylingFeatureConfig } from "./styling.svelte";












interface CustomizationOptions {
  theme?: 'shadcn' | 'default';
  cellTooltips?: boolean;
  customScrollbar?: boolean;
  stickyHeader?: boolean;
}



export type CustomizationFeatureConfig<TOriginalRow> = {
  datagrid?: TzezarsDatagrid<TOriginalRow>
  styling?: StylingFeatureConfig<TOriginalRow>


} & CustomizationOptions




export class CustomizationFeature<TOriginalRow> {
  datagrid: TzezarsDatagrid<TOriginalRow>

  stickyHeader = $state(true)
  cellTooltips = $state(true)
  customScrollbar = $state(true)
  theme = $state('shadcn')

  styling: StylingFeature<TOriginalRow>


  constructor(datagrid: TzezarsDatagrid<TOriginalRow>, config?: CustomizationFeatureConfig<TOriginalRow>) {
    this.datagrid = datagrid
    this.cellTooltips = config?.cellTooltips ?? this.cellTooltips;
    this.theme = config?.theme ?? this.theme;
    this.customScrollbar = config?.customScrollbar ?? this.customScrollbar;
    this.stickyHeader = config?.stickyHeader ?? this.stickyHeader

    this.styling = new StylingFeature(this, config?.styling)
  }
}