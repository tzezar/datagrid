import type { EnhancedDatagrid } from "../index.svelte";
import { StylingFeature, type StylingPluginConfig } from "./styling.svelte";


type PaginationPosition = 'top' | 'bottom' | 'both'
interface IPagination {
  paginationVisibility: boolean;
  paginationPosition: PaginationPosition

  isPaginationEnabled(): boolean
  getPaginationPosition(): PaginationPosition

}

type IAnimations = {
  animateRows: boolean;
  animateHeaders: boolean;
  animationMultiplier: number;

  isAnimatingRowsEnabled(): boolean
  isAnimatingHeadersEnabled(): boolean
  getHeadersFlipDuration(len: number): number
  getRowsFlipDuration(len: number): number

}

interface CustomizationOptions {
  theme?: 'shadcn' | 'default';
  cellTooltips?: boolean;
  customScrollbar?: boolean;
  stickyHeader?: boolean;
  pagination?: boolean;
}

export type CustomizationPluginConfig<TOriginalRow> = {
  datagrid?: EnhancedDatagrid<TOriginalRow>
  styling?: StylingPluginConfig<TOriginalRow>
} & CustomizationOptions

export class CustomizationFeature<TOriginalRow> implements IPagination, IAnimations {
  datagrid: EnhancedDatagrid<TOriginalRow>
  stickyHeader = $state(true)
  cellTooltips = $state(false)
  customScrollbar = $state(true)
  theme = $state('shadcn')

  // Animations
  animateRows: boolean = $state(true)
  animateHeaders: boolean = $state(true)
  animationMultiplier: number = $state(60)

  // Pagination
  paginationVisibility: boolean = $state(true)
  paginationPosition: 'top' | 'bottom' | 'both' = $state('bottom')

  // Column filtering
  styling: StylingFeature<TOriginalRow>

  constructor(datagrid: EnhancedDatagrid<TOriginalRow>, config?: CustomizationPluginConfig<TOriginalRow>) {
    this.datagrid = datagrid
    this.cellTooltips = config?.cellTooltips ?? this.cellTooltips;
    this.theme = config?.theme ?? this.theme;
    this.customScrollbar = config?.customScrollbar ?? this.customScrollbar;
    this.stickyHeader = config?.stickyHeader ?? this.stickyHeader

    this.styling = new StylingFeature(this, config?.styling)
  }


  // Animations methods

  isAnimatingRowsEnabled() {
    return this.animateRows
  }

  isAnimatingHeadersEnabled() {
    return this.animateHeaders
  }

  getHeadersFlipDuration(len: number): number {
    return this.animateHeaders ? Math.sqrt(len) * this.animationMultiplier : 0
  }

  getRowsFlipDuration(len: number): number {
    return this.animateRows ? Math.sqrt(len) * this.animationMultiplier : 0
  }

  // Pagination methods

  isPaginationEnabled() {
    return this.paginationVisibility
  }

  getPaginationPosition() {
    return this.paginationPosition
  }


}