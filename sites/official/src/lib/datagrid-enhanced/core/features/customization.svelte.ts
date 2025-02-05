import type { EnhancedDatagrid } from "../index.svelte";
import { AnimationsFeature, type AnimationsFeatureConfig } from "./animations.svelte";
import { StylingFeature, type StylingFeatureConfig } from "./styling.svelte";



interface CustomizationOptions {
  theme?: 'shadcn' | 'default';
  cellTooltips?: boolean;
  customScrollbar?: boolean;
  stickyHeader?: boolean;
  pagination?: boolean;

  animations?: AnimationsFeatureConfig;
}

export type CustomizationFeatureConfig<TOriginalRow> = {
  datagrid?: EnhancedDatagrid<TOriginalRow>
  styling?: StylingFeatureConfig<TOriginalRow>
} & CustomizationOptions




export class CustomizationFeature<TOriginalRow> {
  datagrid: EnhancedDatagrid<TOriginalRow>
  stickyHeader = $state(true)
  cellTooltips = $state(false)
  customScrollbar = $state(true)
  theme = $state('shadcn')


  animations: AnimationsFeature


  styling: StylingFeature<TOriginalRow>


  constructor(datagrid: EnhancedDatagrid<TOriginalRow>, config?: CustomizationFeatureConfig<TOriginalRow>) {
    this.datagrid = datagrid
    
    this.animations = new AnimationsFeature(this.datagrid, config?.animations)

    this.cellTooltips = config?.cellTooltips ?? this.cellTooltips;
    this.theme = config?.theme ?? this.theme;
    this.customScrollbar = config?.customScrollbar ?? this.customScrollbar;
    this.stickyHeader = config?.stickyHeader ?? this.stickyHeader

    this.styling = new StylingFeature(this, config?.styling)
  }
}