import type { EnhancedDatagrid } from "../index.svelte";
import { ControlCenterFeature, type ControlCenterPluginConfig } from "./control-center.svelte";
import { HeaderCellDropdownMenu, type HeaderCellDropdownMenuPluginConfig } from "./header-cell-dropdown-menu.svelte";
import { StylingFeature, type StylingPluginConfig } from "./styling.svelte";
import { ToolbarCustomization, type ToolbarCustomizationConfig } from "./toolbar.svelte";




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


  toolbar?: ToolbarCustomizationConfig
  headerCellDropdownMenu?: HeaderCellDropdownMenuPluginConfig
  controlCenter?: ControlCenterPluginConfig

} & CustomizationOptions

export class CustomizationFeature<TOriginalRow> {
  datagrid: EnhancedDatagrid<TOriginalRow>
  stickyHeader = $state(true)
  cellTooltips = $state(false)
  customScrollbar = $state(true)
  theme = $state('shadcn')




  toolbar: ToolbarCustomization
  headerCellDropdownMenu: HeaderCellDropdownMenu
  controlCenter: ControlCenterFeature


  // Column filtering
  styling: StylingFeature<TOriginalRow>

  constructor(datagrid: EnhancedDatagrid<TOriginalRow>, config?: CustomizationPluginConfig<TOriginalRow>) {
    this.datagrid = datagrid

    this.toolbar = new ToolbarCustomization(config?.toolbar)
    this.headerCellDropdownMenu = new HeaderCellDropdownMenu(config?.headerCellDropdownMenu)
    this.controlCenter = new ControlCenterFeature(config?.controlCenter)

    this.cellTooltips = config?.cellTooltips ?? this.cellTooltips;
    this.theme = config?.theme ?? this.theme;
    this.customScrollbar = config?.customScrollbar ?? this.customScrollbar;
    this.stickyHeader = config?.stickyHeader ?? this.stickyHeader
    this.styling = new StylingFeature(this, config?.styling)
  }

}