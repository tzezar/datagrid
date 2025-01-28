export { default as VirtualList } from './VirtualListNew.svelte';
export var SCROLL_BEHAVIOR;
(function (SCROLL_BEHAVIOR) {
    SCROLL_BEHAVIOR["AUTO"] = "auto";
    SCROLL_BEHAVIOR["SMOOTH"] = "smooth";
    SCROLL_BEHAVIOR["INSTANT"] = "instant";
})(SCROLL_BEHAVIOR || (SCROLL_BEHAVIOR = {}));
export var ALIGNMENT;
(function (ALIGNMENT) {
    ALIGNMENT["AUTO"] = "auto";
    ALIGNMENT["START"] = "start";
    ALIGNMENT["CENTER"] = "center";
    ALIGNMENT["END"] = "end";
})(ALIGNMENT || (ALIGNMENT = {}));
