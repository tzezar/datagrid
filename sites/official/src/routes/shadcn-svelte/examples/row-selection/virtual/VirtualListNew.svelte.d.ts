import { type Snippet } from 'svelte';
import { ALIGNMENT, SCROLL_BEHAVIOR, type SizingCalculatorFn, type VLRangeEvent, type VLScrollEvent, type VLSlotSignature } from '.';
declare class __sveltets_Render<ItemType> {
    props(): {
        items: ItemType[];
        isDisabled?: boolean;
        isHorizontal?: boolean;
        isTable?: boolean;
        scrollToIndex?: number | undefined;
        scrollToOffset?: number | undefined;
        scrollToAlignment?: ALIGNMENT;
        scrollToBehaviour?: SCROLL_BEHAVIOR;
        preRenderCount?: number;
        header?: Snippet;
        vl_slot: Snippet<[VLSlotSignature<ItemType>]>;
        footer?: Snippet;
        onVisibleRangeUpdate?: ((range: VLRangeEvent) => void) | undefined;
        onAfterScroll?: ((event: VLScrollEvent) => void) | undefined;
        class?: string;
        style?: string;
        sizingCalculator?: SizingCalculatorFn;
    };
    events(): {};
    slots(): {};
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <ItemType>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<ItemType>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<ItemType>['props']>, ReturnType<__sveltets_Render<ItemType>['events']>, ReturnType<__sveltets_Render<ItemType>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<ItemType>['bindings']>;
    } & ReturnType<__sveltets_Render<ItemType>['exports']>;
    <ItemType>(internal: unknown, props: ReturnType<__sveltets_Render<ItemType>['props']> & {}): ReturnType<__sveltets_Render<ItemType>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const VirtualListNew: $$IsomorphicComponent;
type VirtualListNew<ItemType> = InstanceType<typeof VirtualListNew<ItemType>>;
export default VirtualListNew;
