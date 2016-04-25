/**
 * License: see license.txt file.
 */
export declare type UnitValue = number | string;
export declare type LayoutResult = {
    [key: string]: Rect;
};
export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}
/**
 * @interface BaseLayoutInitializer
 * @classdesc
 *
 * Initializer object for a common layout.
 *
 */
export interface BaseLayoutInitializer {
    /**
     * type of the layout, currently: 'element', 'border', 'grid'
     * @member BaseLayoutInitializer#type
     * @type {string}
     */
    type: string;
    /**
     * Layout element name
     * @member BaseLayoutInitializer#name
     * @type {string=}
     */
    name?: string;
    /**
     * Preferred width. Has Unit notation, so values like '10px' or '20%' are valid.
     * @member BaseLayoutInitializer#preferredWidth
     * @type {string=}
     */
    preferredWidth?: string;
    /**
     * Preferred height. Has Unit notation, so values like '10px' or '20%' are valid.
     * @member BaseLayoutInitializer#preferredHeight
     * @type {string=}
     */
    preferredHeight?: string;
    /**
     * Element insets.
     * An array of four strings representing insets for: left, top, right, bottom respectively.
     * Unit notation.
     * @member BaseLayoutInitializer#insets
     * @type {Array<string>=}
     */
    insets?: string[];
    /**
     * Element gap.
     * An array of two strings representing element separation for horizontal and vertical respectively.
     * Unit notation.
     * @member BaseLayoutInitializer#gap
     * @type {Array<string>=}
     */
    gap?: string[];
    /**
     * Array of other layout initializer objects.
     * @member BaseLayoutInitializer#elements
     * @type {Array<BaseLayoutInitializer>} any layout initializer.
     */
    elements?: string[] | BaseLayoutInitializer[];
}
/**
 * @interface GridLayoutInitializer
 * @extends BaseLayoutInitializer
 * @classdesc
 *
 * Initializer object for a grid layout
 *
 */
export interface GridLayoutInitializer extends BaseLayoutInitializer {
    /**
     * Set the grid to grow in columns every number of rows.
     * @member GridLayoutInitializer#rows
     * @type {number=}
     */
    rows?: number;
    /**
     * Set the grid to grow in rows every number of columns.
     * @member GridLayoutInitializer#columns
     * @type {number=}
     */
    columns?: number;
}
/**
 * @interface BorderLayoutInitializer
 * @extends BaseLayoutInitializer
 * @classdesc
 *
 * Initializer for a border layout
 */
export interface BorderLayoutInitializer extends BaseLayoutInitializer {
    /**
     * Left element initializer.
     * @member BorderLayoutInitializer#left
     * @type {BaseLayoutInitializer=}
     */
    left?: BaseLayoutInitializer;
    /**
     * Right element initializer.
     * @member BorderLayoutInitializer#right
     * @type {BaseLayoutInitializer=}
     */
    right?: BaseLayoutInitializer;
    /**
     * Top element initializer.
     * @member BorderLayoutInitializer#top
     * @type {BaseLayoutInitializer=}
     */
    top?: BaseLayoutInitializer;
    /**
     * Bottom element initializer.
     * @member BorderLayoutInitializer#bottom
     * @type {BaseLayoutInitializer=}
     */
    bottom?: BaseLayoutInitializer;
    /**
     * Center element initializer.
     * @member BorderLayoutInitializer#center
     * @type {BaseLayoutInitializer=}
     */
    center?: BaseLayoutInitializer;
}
export declare type LayoutInitializer = BaseLayoutInitializer | GridLayoutInitializer | BorderLayoutInitializer;
/**
 * @class Unit
 * @classdesc
 *
 * This class encapsulates a value in a given unit.
 * Currently, it could be a number, or a percentage value.
 * If the value is a percentage, a call to <code>getValue</code> needs a reference value.
 */
export declare class Unit {
    /**
     * Unit value.
     * @member Unit#_orgValue
     * @type {number}
     * @private
     */
    _orgValue: number;
    /**
     * Unit type. Either px, %, or nothing.
     * @member Unit#_orgType
     * @type {string}
     * @private
     */
    _orgType: string;
    /**
     * Create a new Unit object instance.
     * @method Unit#constructor
     * @param original {string=} Unit value. if not set, the unit it set to 0.
     */
    constructor(original?: string);
    /**
     * Set the unit value. For example '2%', '100px', '100'
     * @method Unit#setValue
     * @param original {string}
     */
    setValue(original: UnitValue): void;
    /**
     * Get the unit value.
     * If the unit type is percentage, and no reference value is supplied, zero will be returned as value.
     * @method Unit#getValue
     * @param ref {number=} percentage reference value.
     * @returns {number}
     */
    getValue(ref?: number): number;
}
/**
 * @class Insets
 * @classdesc
 *
 * This class describes a layout element internal padding.
 * It is descibed as independent inset values for top, bottom, left and right.
 * These values are Unit objects, so can be described as percentage values. The relative values are relative to
 * the Layout element assigned dimension, so its calculation is deferred to the proper layout stage.
 */
export declare class Insets {
    /**
     * Layout element left inset Unit.
     * @member Insets#left
     * @type {Unit}
     */
    left: Unit;
    /**
     * Layout element top inset Unit.
     * @member Insets#top
     * @type {Unit}
     */
    top: Unit;
    /**
     * Layout element right inset Unit.
     * @member Insets#right
     * @type {Unit}
     */
    right: Unit;
    /**
     * Layout element bottom inset Unit.
     * @member Insets#bottom
     * @type {Unit}
     */
    bottom: Unit;
}
/**
 * @class Gap
 * @classdesc
 *
 * This object describes the separation values between two adjacent layout elements.
 * For example, for a grid, describes the Units to separate the grid elements.
 */
export declare class Gap {
    /**
     * Horizontal gap Unit.
     * @member Gap#horizontal
     * @type {Unit}
     */
    horizontal: Unit;
    /**
     * Vertical gap Unit.
     * @member Gap#vertical
     * @type {Unit}
     */
    vertical: Unit;
}
export declare class LL {
    static doLayout(w: number, h: number, layout_def: LayoutInitializer): LayoutResult;
}
