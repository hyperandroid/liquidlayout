/**
 * License: see license.txt file.
 */
export declare type UnitValue = number | string;
export interface Point {
    /**
     * Point x coordinate.
     * @member Point#x
     * @type {number}
     */
    x: number;
    /**
     * Point y coordinate.
     * @member Point#y
     * @type {number}
     */
    y: number;
}
export declare class Dimension {
    width: number;
    height: number;
    constructor(width?: number, height?: number);
    set(d: Dimension): Dimension;
    set(w: number, h: number): Dimension;
    clone(): Dimension;
}
export declare class Rectangle {
    x: number;
    y: number;
    w: number;
    h: number;
    x1: number;
    y1: number;
    constructor(x?: number, y?: number, w?: number, h?: number);
    set(x: number, y: number, w: number, h: number): Rectangle;
    intersectsWith(r: Rectangle): boolean;
    intersects(x: number, y: number, w: number, h: number): boolean;
    normalizeBy(w: number, h: number): Rectangle;
    setEmpty(): void;
    translate(x: number, y: number): Rectangle;
    isEmpty(): boolean;
    intersectWith(r: Rectangle): Rectangle;
    contains(x: number, y: number): boolean;
    contains(x: Point): boolean;
    width: number;
    height: number;
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
    elements?: BaseLayoutInitializer[];
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
/**
 * @class Layout
 * @classdesc
 *
 * This object is the base for all other layout objects.
 * The layout will assign bounds (position and size) for all the layout elements it contains.
 * Layouts will apply different space partitioning rules to conform elements to available space.
 * Layout elements can be nested. for example, a grid cell can contain another grid of elements.
 * <p>
 * Each layout element will have its bounds modified by an <code>Insets</code> object which will reduce the
 * available element bounds.
 * Some layout types, like <code>GridLayout</code> or <code>BorderLayout</code> will be able to apply a gap
 * to separate the contained elements.
 * <p>
 * A layout element can define a preferred size (either in units or percentage) to layout with. This value is
 * needed for layout types that don't impose a size constraint. For example, a GridLayout will set each element's
 * bounds with a fixed rule, that is, dividing the space evenly. But others, like a BorderLayout won't, so you
 * must hint how much space each element is expected to take.
 * <p>
 *     Layouts are defined declaratively and a Node or any other object, does not need to know anything about
 *     the layout itself.
 * <p>
 * The BaseLayout object assumes no children when laying out. Other extending objects will modify this behavior.
 */
export declare class BaseLayout {
    /**
     * Resulting bounds after applying the layout rules.
     * @member BaseLayout#_bounds
     * @type {Rectangle}
     * @private
     */
    _bounds: Rectangle;
    /**
     * The layout insets. Insets will reduce the bounds area by setting a padding for the element.
     * @member BaseLayout#_insets
     * @type {Insets}
     * @private
     */
    _insets: Insets;
    /**
     * Separation between each layout elements. Not all layout will use this value.
     * @member BaseLayout#_gap
     * @type {Gap}
     * @private
     */
    _gap: Gap;
    /**
     * Array of elements to lay out. Since layouts are nestable, children are layout instances as well.
     * @member BaseLayout#_children
     * @type {Array<BaseLayout>}
     * @private
     */
    _children: BaseLayout[];
    /**
     * Layout preferred width Unit hint.
     * @member BaseLayout#_preferredWidth
     * @type {Unit}
     * @private
     */
    _preferredWidth: Unit;
    /**
     * Layout preferred height Unit hint.
     * @member BaseLayout#_preferredHeight
     * @type {Unit}
     * @private
     */
    _preferredHeight: Unit;
    /**
     * Optional layout identifier.
     * This is useful so that a node tag or name can be matched against this layout element.
     * @member BaseLayout#_name
     * @type {string}
     * @private
     */
    _name: string;
    _parent: BaseLayout;
    /**
     * Create a new BaseLayout object instance.
     * Do not create directly, only by subclasses.
     * @method BaseLayout#constructor
     */
    constructor();
    /**
     * Parse a layout initializer object to get a layout element object.
     * @param layout {string|BaseLayoutInitializer} a layout initializer object, or a string.
     *   If a string is set, a BaseLayout object will be used.
     */
    static parse(layout: string | BaseLayoutInitializer): BaseLayout;
    /**
     * Helper method to visually see the layout result.
     * @method BaseLayout#paint
     * @param ctx {CanvasRenderingContext2D}
     */
    paint(ctx: CanvasRenderingContext2D): void;
    /**
     * Set the layout bounds.
     * @method BaseLayout#setBounds
     * @param x {number}
     * @param y {number}
     * @param w {number}
     * @param h {number}
     */
    setBounds(x: number, y: number, w: number, h: number): void;
    /**
     * Set the layout size.
     * @method BaseLayout#setSize
     * @param w {number}
     * @param h {number}
     */
    setSize(w: number, h: number): void;
    /**
     * Set the layout preferred size Unit hints.
     * @param w {number|string}
     * @param h {number|string}
     */
    setPreferredSize(w: UnitValue, h: UnitValue): void;
    /**
     * Get the element preferredSize.
     * The size units are evaluated, so if they are percentage, the value is recalculated now again.
     * @method BaseLayout#getPreferredSize
     * @returns {Dimension}
     */
    getPreferredSize(): Dimension;
    /**
     * Recursively evaluate the layout elements and get the resulting preferred size.
     * This does not take into account the size constraints, will get the desired size.
     * In this object, the implementation returns the result of the preferredSize Unit hints + Insets.
     * @method BaseLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    getPreferredLayoutSize(): Dimension;
    /**
     * Evaluate the layout with the current size constraints. The root layout element bounds will be used
     * as size constraint.
     * @method BaseLayout#doLayout
     */
    doLayout(): void;
    /**
     * Set size constraints and evaluate the layout.
     * The result will be all layout elements have assigned a bounds.
     * @method BaseLayout#layout
     * @param x {number}
     * @param y {number}
     * @param w {number}
     * @param h {number}
     */
    layout(x: number, y: number, w: number, h: number): void;
    /**
     * Parse a layout definition object.
     * This will get all the common layout properties: insets, gap, preferred size and elements.
     * @method BaseLayout#parse
     * @param layoutInfo {BaseLayoutInitializer}
     * @returns {BaseLayout}
     */
    parse(layoutInfo: BaseLayoutInitializer): BaseLayout;
    /**
     * Parse the elements block from the layout initializer object.
     * @method BaseLayout#parseElements
     * @param children {Array<object>}
     */
    parseElements(children: Array<any>): void;
    /**
     * Add an element layout to this layout object.
     * @param e {BaseLayout}
     * @param constraint {string=} a constraint to add an element. For example, BorderLayout requires a position hint
     *      to add an element.
     */
    addElement(e: BaseLayout, constraint?: string): void;
    /**
     * Helper method to add the Inset object value to a Dimension.
     * @method BaseLayout#adjustWithInsets
     * @param d
     */
    adjustWithInsets(d: Dimension): void;
}
/**
 * @class BorderLayout
 * @extends BaseLayout
 * @classdesc
 *
 * A BorderLayout object divides the available space in up to 5 different regions as follows:
 * <pre>
 *
 *     +----------------------------+
 *     |            TOP             |
 *     +------+-------------+-------+
 *     | LEFT |             | RIGHT |
 *     |      |             |       |
 *     |      |             |       |
 *     |      |   CENTER    |       |
 *     |      |             |       |
 *     |      |             |       |
 *     |      |             |       |
 *     +------+-------------+-------+
 *     |           BOTTOM           |
 *     +----------------------------+
 * </pre>
 *
 * <p>
 *     Since all bounds are dynamically calculated, elements added to a BorderLayout (at any nesting level) must
 *     have preferred size hints.
 * <p>
 *     The gap values will be empty filler values between every elements. Horizontal between left-center center-right
 *     and vertical betweeen top and bottom and all the others.
 * <p>
 *     All Elements are optional to define.
 * <p>
 *     The center element will get the remaining space after laying out all the other elements.
 *     The left, right and center elements will get the remaining height after evaluating top and then
 *     bottom elements.
 * <p>
 *     top, left, right, bottom and center can be, at the same time, other layouts.
 *
 */
export declare class BorderLayout extends BaseLayout {
    /**
     * Left layout element.
     * @member BorderLayout#_left
     * @type {BaseLayout}
     * @private
     */
    _left: BaseLayout;
    /**
     * Right layout element.
     * @member BorderLayout#_right
     * @type {BaseLayout}
     * @private
     */
    _right: BaseLayout;
    /**
     * Top layout element.
     * @member BorderLayout#_top
     * @type {BaseLayout}
     * @private
     */
    _top: BaseLayout;
    /**
     * Bottom layout element.
     * @member BorderLayout#_bottom
     * @type {BaseLayout}
     * @private
     */
    _bottom: BaseLayout;
    /**
     * Center layout element.
     * @member BorderLayout#_center
     * @type {BaseLayout}
     * @private
     */
    _center: BaseLayout;
    /**
     * Build a new BorderLayout object instance
     * @method BorderLayout#constructor
     */
    constructor();
    /**
     * Get the preferred layout size after recursively applying the layout. The size will be the preferred size,
     * not the actual size.
     * @method BorderLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    getPreferredLayoutSize(): Dimension;
    /**
     * Set the left layout element.
     * @method BorderLayout#left
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    left(e: BaseLayout): BorderLayout;
    /**
     * Set the right layout element.
     * @method BorderLayout#right
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    right(e: BaseLayout): BorderLayout;
    /**
     * Set the top layout element.
     * @method BorderLayout#top
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    top(e: BaseLayout): BorderLayout;
    /**
     * Set the bottom layout element.
     * @method BorderLayout#bottom
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    bottom(e: BaseLayout): BorderLayout;
    /**
     * Set the center layout element.
     * @method BorderLayout#center
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    center(e: BaseLayout): BorderLayout;
    /**
     * Parse the BorderLayout.
     * @method BorderLayout#parse
     * @param layoutInfo {BorderLayoutInitializer}
     * @returns {BorderLayout}
     */
    parse(layoutInfo: BorderLayoutInitializer): BorderLayout;
    /**
     * Add an element to the layout. Since this layout only allows for 5 specific elements, an adding constraint
     * must be used.
     * @method BorderLayout#addElement
     * @param e {BaseLayout}
     * @param constraint {string} must exist. a value from 'top','bottom','left','right' or 'center'.
     */
    addElement(e: BaseLayout, constraint: string): void;
    /**
     * Do the actual lay out process. Elements will fit into the previously set element bounds.
     * @method BorderLayout#doLayout
     */
    doLayout(): void;
}
/**
 * @class GridLayout
 * @extends BaseLayout
 * @classdesc
 *
 * A grid layout lays elements out either in rows or columns. If rows are specified, the lay out will keep the fixed
 * number of rows and grow on the number of columns or vice versa, like as follows:
 *
 * <pre>
 *
 *     3 rows                        3 columns
 *
 *     +------------+-----...        +----------+----------+----------+
 *     |  row1      |                |   col1   |   col2   |   col3   |
 *     +------------+-----...        +----------+----------+----------+
 *     |  row2      |                |          |          |          |
 *     +------------+-----...        .          .          .          .
 *     |  row3      |                .          .          .          .
 *     +------------+-----...
 * </pre>
 *
 */
export declare class GridLayout extends BaseLayout {
    /**
     * Lay out in rows or columns.
     * @member GridLayout#_layoutRows
     * @type {boolean}
     * @private
     */
    _layoutRows: boolean;
    /**
     * Elements to layout before adding a row or column.
     * @member GridLayout#_numElements
     * @type {number}
     * @private
     */
    _numElements: number;
    /**
     * Calculated number of rows for the current added elements.
     * @member GridLayout#_rows
     * @type {number}
     * @private
     */
    _rows: number;
    /**
     * Calculated number of columns for the current added elements.
     * @member GridLayout#_columns
     * @type {number}
     * @private
     */
    _columns: number;
    /**
     * Create a new GridLayout object instance.
     * @method GridLayout#constructor
     */
    constructor();
    /**
     * Parse the grid info.
     * @method GridLayout#parse
     * @param layoutInfo {GridLayoutInitializer}
     * @returns {GridLayout}
     */
    parse(layoutInfo: GridLayoutInitializer): GridLayout;
    /**
     * Get the preferred layout elements size. The preferred size will be the adjusted to the biggest element's
     * preferred size, adding the gap for each of the layout elements.
     * Finally, the insets will be added to the size.
     * @method GridLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    getPreferredLayoutSize(): Dimension;
    /**
     * Do the actual elements lay out. The size of each element will be constrained to the element's bound.
     * @method GridLayout#doLayout
     */
    doLayout(): void;
}
/**
 * @class LayerLayout
 * @extends BaseLayout
 * @classdesc
 *
 * A LayerLayout stacks elements one on top of the other making their bounds the same.
 * The layout does not work on z-index, simply makes them to take over the same area.
 *
 */
export declare class LayerLayout extends BaseLayout {
    /**
     * Build a new LayerLayout
     * @method LayerLayout#constructor
     */
    constructor();
    /**
     * @method LayerLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    getPreferredLayoutSize(): Dimension;
    /**
     * @method LayerLayout#doLayout
     */
    doLayout(): void;
}
export declare class ll {
    static doLayout(layout: any): any;
}
