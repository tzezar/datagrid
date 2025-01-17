import { GroupingFeature } from "$lib/datagrid/core/features";



export class ExtraGroupingFeature extends GroupingFeature {
    enableGrouping: boolean = $state(true);
    onGroupingChange(expandedGroups: string[]) {}
    manualGrouping: boolean = $state(false);
}