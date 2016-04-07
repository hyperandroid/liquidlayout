/**
 * License: see license.txt file.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dimension = (function () {
    function Dimension(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.width = width;
        this.height = height;
    }
    Dimension.prototype.set = function (w, h) {
        if (typeof w === 'number') {
            this.width = w;
            this.height = h;
        }
        else {
            var d = w;
            this.width = d.width;
            this.height = d.height;
        }
        return this;
    };
    Dimension.prototype.clone = function () {
        return new Dimension(this.width, this.height);
    };
    return Dimension;
}());
var Rectangle = (function () {
    function Rectangle(x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.x1 = 0;
        this.y1 = 0;
        this.set(x, y, w, h);
    }
    Rectangle.prototype.set = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.x1 = x + w;
        this.y1 = y + h;
        return this;
    };
    Rectangle.prototype.intersectsWith = function (r) {
        return this.intersects(r.x, r.y, r.w, r.h);
    };
    Rectangle.prototype.intersects = function (x, y, w, h) {
        if (this.x1 < x) {
            return false;
        }
        if (this.y1 < y) {
            return false;
        }
        if (this.x >= x + w) {
            return false;
        }
        if (this.y >= y + h) {
            return false;
        }
        return true;
    };
    Rectangle.prototype.normalizeBy = function (w, h) {
        this.x /= w;
        this.y /= h;
        this.x1 /= w;
        this.y1 /= h;
        this.w /= w;
        this.h /= h;
        return this;
    };
    Rectangle.prototype.setEmpty = function () {
        this.x = 0;
        this.y = 0;
        this.x1 = 0;
        this.y1 = 0;
        this.w = 0;
        this.h = 0;
    };
    Rectangle.prototype.translate = function (x, y) {
        this.x += x;
        this.y += y;
        this.x1 += x;
        this.y1 += y;
        return this;
    };
    Rectangle.prototype.isEmpty = function () {
        return this.w === 0 || this.h === 0;
    };
    Rectangle.prototype.intersectWith = function (r) {
        if (this.intersectsWith(r)) {
            if (this.x < r.x) {
                this.w -= r.x - this.x;
                this.x = r.x;
            }
            if (this.y < r.y) {
                this.h -= r.y - this.y;
                this.y = r.y;
            }
            if (this.w > r.w) {
                this.w = r.w;
            }
            if (this.h > r.h) {
                this.h = r.h;
            }
            this.x1 = this.x + this.w;
            this.y1 = this.y + this.h;
        }
        else {
            this.setEmpty();
        }
        return this;
    };
    Rectangle.prototype.contains = function (x, y) {
        var tx;
        var ty;
        if (typeof x !== "number") {
            var v = x;
            tx = v.x;
            ty = v.y;
        }
        else {
            tx = x;
            ty = y;
        }
        return tx >= this.x && ty >= this.y && tx < this.x1 && ty < this.y1;
    };
    Object.defineProperty(Rectangle.prototype, "width", {
        get: function () {
            return this.w;
        },
        set: function (w) {
            this.w = w;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "height", {
        get: function () {
            return this.h;
        },
        set: function (h) {
            this.h = h;
        },
        enumerable: true,
        configurable: true
    });
    return Rectangle;
}());
/**
 * @class Unit
 * @classdesc
 *
 * This class encapsulates a value in a given unit.
 * Currently, it could be a number, or a percentage value.
 * If the value is a percentage, a call to <code>getValue</code> needs a reference value.
 */
var Unit = (function () {
    /**
     * Create a new Unit object instance.
     * @method Unit#constructor
     * @param original {string=} Unit value. if not set, the unit it set to 0.
     */
    function Unit(original) {
        /**
         * Unit value.
         * @member Unit#_orgValue
         * @type {number}
         * @private
         */
        this._orgValue = 0;
        /**
         * Unit type. Either px, %, or nothing.
         * @member Unit#_orgType
         * @type {string}
         * @private
         */
        this._orgType = "";
        if (typeof original !== 'undefined') {
            this.setValue(original);
        }
    }
    /**
     * Set the unit value. For example '2%', '100px', '100'
     * @method Unit#setValue
     * @param original {string}
     */
    Unit.prototype.setValue = function (original) {
        var exp = new RegExp("\\d+\\.?\\d*(.*)", "gi");
        var m = exp.exec("" + original);
        if (m) {
            this._orgType = m[1];
            this._orgValue = parseInt(m[0]);
        }
    };
    /**
     * Get the unit value.
     * If the unit type is percentage, and no reference value is supplied, zero will be returned as value.
     * @method Unit#getValue
     * @param ref {number=} percentage reference value.
     * @returns {number}
     */
    Unit.prototype.getValue = function (ref) {
        switch (this._orgType) {
            case "":
                return this._orgValue;
            case "px":
                return this._orgValue;
            case "%":
                return typeof ref !== "undefined" ? this._orgValue / 100 * ref : 0;
        }
    };
    return Unit;
}());
/**
 * @class Insets
 * @classdesc
 *
 * This class describes a layout element internal padding.
 * It is descibed as independent inset values for top, bottom, left and right.
 * These values are Unit objects, so can be described as percentage values. The relative values are relative to
 * the Layout element assigned dimension, so its calculation is deferred to the proper layout stage.
 */
var Insets = (function () {
    function Insets() {
        /**
         * Layout element left inset Unit.
         * @member Insets#left
         * @type {Unit}
         */
        this.left = new Unit();
        /**
         * Layout element top inset Unit.
         * @member Insets#top
         * @type {Unit}
         */
        this.top = new Unit();
        /**
         * Layout element right inset Unit.
         * @member Insets#right
         * @type {Unit}
         */
        this.right = new Unit();
        /**
         * Layout element bottom inset Unit.
         * @member Insets#bottom
         * @type {Unit}
         */
        this.bottom = new Unit();
    }
    return Insets;
}());
/**
 * @class Gap
 * @classdesc
 *
 * This object describes the separation values between two adjacent layout elements.
 * For example, for a grid, describes the Units to separate the grid elements.
 */
var Gap = (function () {
    function Gap() {
        /**
         * Horizontal gap Unit.
         * @member Gap#horizontal
         * @type {Unit}
         */
        this.horizontal = new Unit();
        /**
         * Vertical gap Unit.
         * @member Gap#vertical
         * @type {Unit}
         */
        this.vertical = new Unit();
    }
    return Gap;
}());
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
var BaseLayout = (function () {
    /**
     * Create a new BaseLayout object instance.
     * Do not create directly, only by subclasses.
     * @method BaseLayout#constructor
     */
    function BaseLayout() {
        /**
         * Resulting bounds after applying the layout rules.
         * @member BaseLayout#_bounds
         * @type {Rectangle}
         * @private
         */
        this._bounds = null;
        /**
         * The layout insets. Insets will reduce the bounds area by setting a padding for the element.
         * @member BaseLayout#_insets
         * @type {Insets}
         * @private
         */
        this._insets = null;
        /**
         * Separation between each layout elements. Not all layout will use this value.
         * @member BaseLayout#_gap
         * @type {Gap}
         * @private
         */
        this._gap = null;
        /**
         * Array of elements to lay out. Since layouts are nestable, children are layout instances as well.
         * @member BaseLayout#_children
         * @type {Array<BaseLayout>}
         * @private
         */
        this._children = [];
        /**
         * Layout preferred width Unit hint.
         * @member BaseLayout#_preferredWidth
         * @type {Unit}
         * @private
         */
        this._preferredWidth = null;
        /**
         * Layout preferred height Unit hint.
         * @member BaseLayout#_preferredHeight
         * @type {Unit}
         * @private
         */
        this._preferredHeight = null;
        /**
         * Optional layout identifier.
         * This is useful so that a node tag or name can be matched against this layout element.
         * @member BaseLayout#_name
         * @type {string}
         * @private
         */
        this._name = '';
        this._parent = null;
        this._bounds = new Rectangle();
        this._insets = new Insets();
        this._gap = new Gap();
        this._preferredWidth = new Unit();
        this._preferredHeight = new Unit();
    }
    /**
     * Parse a layout initializer object to get a layout element object.
     * @param layout {string|BaseLayoutInitializer} a layout initializer object, or a string.
     *   If a string is set, a BaseLayout object will be used.
     */
    BaseLayout.parse = function (layout) {
        if (typeof layout === "string") {
            return new BaseLayout().parse({
                type: 'element',
                name: layout
            });
        }
        else if (layout.type === "element") {
            return new BaseLayout().parse(layout);
        }
        else if (layout.type === "border") {
            return new BorderLayout().parse(layout);
        }
        else if (layout.type === "layer") {
            return new LayerLayout().parse(layout);
        }
        else if (layout.type === "grid") {
            return new GridLayout().parse(layout);
        }
        else {
            console.log("unknown layout type: " + layout.type);
        }
    };
    /**
     * Helper method to visually see the layout result.
     * @method BaseLayout#paint
     * @param ctx {CanvasRenderingContext2D}
     */
    BaseLayout.prototype.paint = function (ctx) {
        //ctx.setTransform(1,0,0,1,0,0);
        ctx.strokeRect(this._bounds.x, this._bounds.y, this._bounds.w, this._bounds.h);
        for (var i = 0; i < this._children.length; i++) {
            this._children[i].paint(ctx);
        }
    };
    /**
     * Set the layout bounds.
     * @method BaseLayout#setBounds
     * @param x {number}
     * @param y {number}
     * @param w {number}
     * @param h {number}
     */
    BaseLayout.prototype.setBounds = function (x, y, w, h) {
        this._bounds.set(x, y, w, h);
    };
    /**
     * Set the layout size.
     * @method BaseLayout#setSize
     * @param w {number}
     * @param h {number}
     */
    BaseLayout.prototype.setSize = function (w, h) {
        this._bounds.w = w;
        this._bounds.h = h;
    };
    /**
     * Set the layout preferred size Unit hints.
     * @param w {number|string}
     * @param h {number|string}
     */
    BaseLayout.prototype.setPreferredSize = function (w, h) {
        this._preferredWidth.setValue(w);
        this._preferredHeight.setValue(h);
    };
    /**
     * Get the element preferredSize.
     * The size units are evaluated, so if they are percentage, the value is recalculated now again.
     * @method BaseLayout#getPreferredSize
     * @returns {Dimension}
     */
    BaseLayout.prototype.getPreferredSize = function () {
        return new Dimension(this._preferredWidth.getValue(this._parent ? this._parent._bounds.w : this._bounds.w), this._preferredHeight.getValue(this._parent ? this._parent._bounds.h : this._bounds.h));
    };
    /**
     * Recursively evaluate the layout elements and get the resulting preferred size.
     * This does not take into account the size constraints, will get the desired size.
     * In this object, the implementation returns the result of the preferredSize Unit hints + Insets.
     * @method BaseLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    BaseLayout.prototype.getPreferredLayoutSize = function () {
        var ps = this.getPreferredSize();
        this.adjustWithInsets(ps);
        return ps;
    };
    /**
     * Evaluate the layout with the current size constraints. The root layout element bounds will be used
     * as size constraint.
     * @method BaseLayout#doLayout
     */
    BaseLayout.prototype.doLayout = function () {
        var d = new Dimension();
        this.adjustWithInsets(d);
        this._bounds.w -= d.width;
        this._bounds.h -= d.height;
        this._bounds.x += d.width / 2;
        this._bounds.y += d.height / 2;
    };
    /**
     * Set size constraints and evaluate the layout.
     * The result will be all layout elements have assigned a bounds.
     * @method BaseLayout#layout
     * @param x {number}
     * @param y {number}
     * @param w {number}
     * @param h {number}
     */
    BaseLayout.prototype.layout = function (x, y, w, h) {
        this.setBounds(x, y, w, h);
        this.getPreferredLayoutSize();
        this.doLayout();
    };
    /**
     * Parse a layout definition object.
     * This will get all the common layout properties: insets, gap, preferred size and elements.
     * @method BaseLayout#parse
     * @param layoutInfo {BaseLayoutInitializer}
     * @returns {BaseLayout}
     */
    BaseLayout.prototype.parse = function (layoutInfo) {
        if (typeof layoutInfo.insets !== 'undefined') {
            var arr = layoutInfo.insets;
            if (arr.length !== 4) {
                console.log("wrong defined insets: " + arr);
            }
            this._insets.left.setValue(layoutInfo.insets[0]);
            this._insets.right.setValue(layoutInfo.insets[2]);
            this._insets.top.setValue(layoutInfo.insets[1]);
            this._insets.bottom.setValue(layoutInfo.insets[3]);
        }
        if (typeof layoutInfo.gap !== 'undefined') {
            var arr = layoutInfo.gap;
            if (arr.length !== 2) {
                console.log("wrong defined gap: " + arr);
            }
            this._gap.horizontal.setValue(layoutInfo.gap[0]);
            this._gap.vertical.setValue(layoutInfo.gap[1]);
        }
        if (typeof layoutInfo.preferredWidth !== 'undefined') {
            this._preferredWidth.setValue(layoutInfo.preferredWidth);
        }
        if (typeof layoutInfo.preferredHeight !== 'undefined') {
            this._preferredHeight.setValue(layoutInfo.preferredHeight);
        }
        if (typeof layoutInfo.name !== 'undefined') {
            this._name = layoutInfo.name;
        }
        if (typeof layoutInfo.elements !== 'undefined') {
            if (Object.prototype.toString.call(layoutInfo.elements) === '[object Array]') {
                this.parseElements(layoutInfo.elements);
            }
            else {
                console.log("Layout elements block is not array.");
            }
        }
        return this;
    };
    /**
     * Parse the elements block from the layout initializer object.
     * @method BaseLayout#parseElements
     * @param children {Array<object>}
     */
    BaseLayout.prototype.parseElements = function (children) {
        var me = this;
        function addElement(s, parent) {
            var elem = BaseLayout.parse(s);
            if (elem) {
                elem._parent = parent;
                me._children.push(elem);
            }
            else {
            }
        }
        for (var i = 0; i < children.length; i++) {
            if (typeof children[i] === 'string') {
                var elem = children[i];
                // is elem of the form text[...] ?
                if (elem.indexOf('[') !== -1 && elem.indexOf(']') !== -1) {
                    var exp = new RegExp("(.*)\\[(.*)\\]", "gi");
                    var m = exp.exec(elem);
                    var prefix = m[1];
                    var pattern = m[2].split('-');
                    if (pattern.length === 2) {
                        var from = parseInt(pattern[0]);
                        var to = parseInt(pattern[1]);
                        while (from <= to) {
                            addElement(prefix + from, this);
                            from++;
                        }
                    }
                    else {
                        /// wrong pattern ?!?!?!?!?
                        console.log("wrong pattern for element by name: " + elem);
                        addElement(elem, this);
                    }
                }
                else {
                    // not name pattern.
                    addElement(elem, this);
                }
            }
            else {
                addElement(children[i], this);
            }
        }
    };
    /**
     * Add an element layout to this layout object.
     * @param e {BaseLayout}
     * @param constraint {string=} a constraint to add an element. For example, BorderLayout requires a position hint
     *      to add an element.
     */
    BaseLayout.prototype.addElement = function (e, constraint) {
        this._children.push(e);
    };
    /**
     * Helper method to add the Inset object value to a Dimension.
     * @method BaseLayout#adjustWithInsets
     * @param d
     */
    BaseLayout.prototype.adjustWithInsets = function (d) {
        d.width += this._insets.left.getValue(this._bounds.w) + this._insets.right.getValue(this._bounds.w);
        d.height += this._insets.top.getValue(this._bounds.h) + this._insets.bottom.getValue(this._bounds.h);
    };
    BaseLayout.prototype.__getLayout = function () {
        var r = this._bounds;
        return {
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height
        };
    };
    BaseLayout.prototype.__enumerateLayout = function (map) {
        if (this._name !== "") {
            map[this._name] = this.__getLayout();
        }
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.__enumerateLayout(map);
        }
        return map;
    };
    BaseLayout.prototype.enumerateLayout = function () {
        return this.__enumerateLayout({});
    };
    return BaseLayout;
}());
exports.BaseLayout = BaseLayout;
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
var BorderLayout = (function (_super) {
    __extends(BorderLayout, _super);
    /**
     * Build a new BorderLayout object instance
     * @method BorderLayout#constructor
     */
    function BorderLayout() {
        _super.call(this);
        /**
         * Left layout element.
         * @member BorderLayout#_left
         * @type {BaseLayout}
         * @private
         */
        this._left = null;
        /**
         * Right layout element.
         * @member BorderLayout#_right
         * @type {BaseLayout}
         * @private
         */
        this._right = null;
        /**
         * Top layout element.
         * @member BorderLayout#_top
         * @type {BaseLayout}
         * @private
         */
        this._top = null;
        /**
         * Bottom layout element.
         * @member BorderLayout#_bottom
         * @type {BaseLayout}
         * @private
         */
        this._bottom = null;
        /**
         * Center layout element.
         * @member BorderLayout#_center
         * @type {BaseLayout}
         * @private
         */
        this._center = null;
    }
    /**
     * Get the preferred layout size after recursively applying the layout. The size will be the preferred size,
     * not the actual size.
     * @method BorderLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    BorderLayout.prototype.getPreferredLayoutSize = function () {
        var ret = new Dimension();
        var d;
        if (this._left) {
            d = this._left.getPreferredLayoutSize();
            ret.width += d.width + this._gap.horizontal.getValue(this._bounds.w);
            ret.height = Math.max(d.height, ret.height);
        }
        if (this._right) {
            d = this._right.getPreferredLayoutSize();
            ret.width += d.width + this._gap.horizontal.getValue(this._bounds.w);
            ret.height = Math.max(d.height, ret.height);
        }
        if (this._center) {
            d = this._center.getPreferredLayoutSize();
            ret.width += d.width;
            ret.height = Math.max(d.height, ret.height);
        }
        if (this._top) {
            d = this._top.getPreferredLayoutSize();
            ret.height += d.height + this._gap.vertical.getValue(this._bounds.h);
            ret.width = Math.max(ret.width, d.width);
        }
        if (this._bottom) {
            d = this._bottom.getPreferredLayoutSize();
            ret.height += d.height + this._gap.vertical.getValue(this._bounds.h);
            ret.width = Math.max(ret.width, d.width);
        }
        this.adjustWithInsets(d);
        var pd = this.getPreferredSize();
        d.width = Math.max(d.width, pd.width);
        d.height = Math.max(d.width, pd.height);
        return d;
    };
    /**
     * Set the left layout element.
     * @method BorderLayout#left
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    BorderLayout.prototype.left = function (e) {
        this._children.push(e);
        this._left = e;
        this._left._parent = this;
        return this;
    };
    /**
     * Set the right layout element.
     * @method BorderLayout#right
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    BorderLayout.prototype.right = function (e) {
        this._children.push(e);
        this._right = e;
        this._right._parent = this;
        return this;
    };
    /**
     * Set the top layout element.
     * @method BorderLayout#top
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    BorderLayout.prototype.top = function (e) {
        this._children.push(e);
        this._top = e;
        this._top._parent = this;
        return this;
    };
    /**
     * Set the bottom layout element.
     * @method BorderLayout#bottom
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    BorderLayout.prototype.bottom = function (e) {
        this._children.push(e);
        this._bottom = e;
        this._bottom._parent = this;
        return this;
    };
    /**
     * Set the center layout element.
     * @method BorderLayout#center
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    BorderLayout.prototype.center = function (e) {
        this._children.push(e);
        this._center = e;
        this._center._parent = this;
        return this;
    };
    /**
     * Parse the BorderLayout.
     * @method BorderLayout#parse
     * @param layoutInfo {BorderLayoutInitializer}
     * @returns {BorderLayout}
     */
    BorderLayout.prototype.parse = function (layoutInfo) {
        _super.prototype.parse.call(this, layoutInfo);
        if (typeof layoutInfo.left !== "undefined") {
            this.left(BaseLayout.parse(layoutInfo.left));
        }
        if (typeof layoutInfo.right !== "undefined") {
            this.right(BaseLayout.parse(layoutInfo.right));
        }
        if (typeof layoutInfo.bottom !== "undefined") {
            this.bottom(BaseLayout.parse(layoutInfo.bottom));
        }
        if (typeof layoutInfo.top !== "undefined") {
            this.top(BaseLayout.parse(layoutInfo.top));
        }
        if (typeof layoutInfo.center !== "undefined") {
            this.center(BaseLayout.parse(layoutInfo.center));
        }
        return this;
    };
    /**
     * Add an element to the layout. Since this layout only allows for 5 specific elements, an adding constraint
     * must be used.
     * @method BorderLayout#addElement
     * @param e {BaseLayout}
     * @param constraint {string} must exist. a value from 'top','bottom','left','right' or 'center'.
     */
    BorderLayout.prototype.addElement = function (e, constraint) {
        switch (constraint) {
            case 'top':
                this.top(e);
                break;
            case 'bottom':
                this.bottom(e);
                break;
            case 'left':
                this.left(e);
                break;
            case 'right':
                this.right(e);
                break;
            case 'center':
                this.center(e);
                break;
            default:
                console.log("wrong border layout constraint.");
        }
    };
    /**
     * Do the actual lay out process. Elements will fit into the previously set element bounds.
     * @method BorderLayout#doLayout
     */
    BorderLayout.prototype.doLayout = function () {
        var left = this._bounds.x + this._insets.left.getValue(this._bounds.w);
        var top = this._bounds.y + this._insets.top.getValue(this._bounds.h);
        var right = this._bounds.x1 - this._insets.right.getValue(this._bounds.w);
        var bottom = this._bounds.y1 - this._insets.bottom.getValue(this._bounds.h);
        var d;
        if (this._top) {
            this._top.setSize(right - left, this._top._bounds.h);
            d = this._top.getPreferredLayoutSize();
            this._top._bounds.set(left, top, right - left, d.height);
            this._top.doLayout();
            top += d.height + this._gap.vertical.getValue(this._bounds.h);
        }
        if (this._bottom) {
            this._bottom.setSize(right - left, this._bottom._bounds.h);
            d = this._bottom.getPreferredLayoutSize();
            d.height = Math.min(d.height, bottom - top);
            this._bottom._bounds.set(left, bottom - d.height, right - left, d.height);
            this._bottom.doLayout();
            bottom -= d.height + this._gap.vertical.getValue(this._bounds.h);
        }
        if (this._right) {
            this._right.setSize(this._right._bounds.w, bottom - top);
            d = this._right.getPreferredLayoutSize();
            this._right._bounds.set(right - d.width, top, d.width, bottom - top);
            this._right.doLayout();
            right -= d.width + this._gap.horizontal.getValue(this._bounds.w);
        }
        if (this._left) {
            this._left.setSize(this._left._bounds.w, bottom - top);
            d = this._left.getPreferredLayoutSize();
            d.width = Math.min(d.width, right - left);
            this._left._bounds.set(left, top, d.width, bottom - top);
            this._left.doLayout();
            left += d.width + this._gap.horizontal.getValue(this._bounds.w);
        }
        if (this._center) {
            this._center._bounds.set(left, top, right - left, bottom - top);
            this._center.doLayout();
        }
    };
    return BorderLayout;
}(BaseLayout));
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
var GridLayout = (function (_super) {
    __extends(GridLayout, _super);
    /**
     * Create a new GridLayout object instance.
     * @method GridLayout#constructor
     */
    function GridLayout() {
        _super.call(this);
        /**
         * Lay out in rows or columns.
         * @member GridLayout#_layoutRows
         * @type {boolean}
         * @private
         */
        this._layoutRows = false;
        /**
         * Elements to layout before adding a row or column.
         * @member GridLayout#_numElements
         * @type {number}
         * @private
         */
        this._numElements = 0;
        /**
         * Calculated number of rows for the current added elements.
         * @member GridLayout#_rows
         * @type {number}
         * @private
         */
        this._rows = 0;
        /**
         * Calculated number of columns for the current added elements.
         * @member GridLayout#_columns
         * @type {number}
         * @private
         */
        this._columns = 0;
    }
    /**
     * Parse the grid info.
     * @method GridLayout#parse
     * @param layoutInfo {GridLayoutInitializer}
     * @returns {GridLayout}
     */
    GridLayout.prototype.parse = function (layoutInfo) {
        _super.prototype.parse.call(this, layoutInfo);
        if (typeof layoutInfo.rows !== 'undefined') {
            this._layoutRows = true;
            this._numElements = layoutInfo.rows;
        }
        if (typeof layoutInfo.columns !== 'undefined') {
            this._layoutRows = false;
            this._numElements = layoutInfo.columns;
        }
        if (!this._numElements) {
            throw "bug bug grid info wrong defined.";
        }
        return this;
    };
    /**
     * Get the preferred layout elements size. The preferred size will be the adjusted to the biggest element's
     * preferred size, adding the gap for each of the layout elements.
     * Finally, the insets will be added to the size.
     * @method GridLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    GridLayout.prototype.getPreferredLayoutSize = function () {
        var rows = 0;
        var columns = 0;
        var ret = new Dimension();
        if (this._layoutRows) {
            rows = this._numElements;
            columns = ((rows + this._children.length - 1) / rows) >> 0;
        }
        else {
            columns = this._numElements;
            rows = ((columns + this._children.length - 1) / columns) >> 0;
        }
        for (var i = 0; i < this._children.length; i++) {
            var d = this._children[i].getPreferredLayoutSize();
            if (d.width > ret.width) {
                ret.width = d.width;
            }
            if (d.height > ret.height) {
                ret.height = d.height;
            }
        }
        this.adjustWithInsets(d);
        d.width += columns * ret.width + (columns - 1) * this._gap.horizontal.getValue(this._bounds.w);
        d.height += rows * ret.height + (rows - 1) * this._gap.vertical.getValue(this._bounds.h);
        var pd = this.getPreferredSize();
        d.width = Math.max(d.width, pd.width);
        d.height = Math.max(d.height, pd.height);
        this._rows = rows;
        this._columns = columns;
        return d;
    };
    /**
     * Do the actual elements lay out. The size of each element will be constrained to the element's bound.
     * @method GridLayout#doLayout
     */
    GridLayout.prototype.doLayout = function () {
        if (!this._children.length) {
            return;
        }
        var rows;
        var columns;
        if (this._layoutRows) {
            rows = this._numElements;
            columns = ((rows + this._children.length - 1) / rows) >> 0;
        }
        else {
            columns = this._numElements;
            rows = ((columns + this._children.length - 1) / columns) >> 0;
        }
        this._rows = rows;
        this._columns = columns;
        var nrows = this._rows;
        var ncols = this._columns;
        var totalGapsWidth = (ncols - 1) * this._gap.horizontal.getValue(this._bounds.w);
        var widthWOInsets = this._bounds.w - (this._insets.left.getValue(this._bounds.w) + this._insets.right.getValue(this._bounds.w));
        var widthOnComponent = ((widthWOInsets - totalGapsWidth) / ncols); // floor
        var extraWidthAvailable = ((widthWOInsets - (widthOnComponent * ncols + totalGapsWidth)) / 2); // floor
        var totalGapsHeight = (nrows - 1) * this._gap.vertical.getValue(this._bounds.h);
        var heightWOInsets = this._bounds.h - (this._insets.top.getValue(this._bounds.h) + this._insets.bottom.getValue(this._bounds.h));
        var heightOnComponent = ((heightWOInsets - totalGapsHeight) / nrows); // floor
        var extraHeightAvailable = ((heightWOInsets - (heightOnComponent * nrows + totalGapsHeight)) / 2); // floor
        for (var c = 0, x = this._insets.left.getValue(this._bounds.w) + extraWidthAvailable; c < ncols; c++, x += widthOnComponent + this._gap.horizontal.getValue(this._bounds.w)) {
            for (var r = 0, y = this._insets.top.getValue(this._bounds.h) + extraHeightAvailable; r < nrows; r++, y += heightOnComponent + this._gap.vertical.getValue(this._bounds.h)) {
                var i = r * ncols + c;
                if (i < this._children.length) {
                    var child = this._children[i];
                    if (null !== child) {
                        child.setBounds(this._bounds.x + x, this._bounds.y + y, widthOnComponent, heightOnComponent);
                        child.doLayout();
                    }
                }
            }
        }
    };
    return GridLayout;
}(BaseLayout));
/**
 * @class LayerLayout
 * @extends BaseLayout
 * @classdesc
 *
 * A LayerLayout stacks elements one on top of the other making their bounds the same.
 * The layout does not work on z-index, simply makes them to take over the same area.
 *
 */
var LayerLayout = (function (_super) {
    __extends(LayerLayout, _super);
    /**
     * Build a new LayerLayout
     * @method LayerLayout#constructor
     */
    function LayerLayout() {
        _super.call(this);
    }
    /**
     * @method LayerLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    LayerLayout.prototype.getPreferredLayoutSize = function () {
        var d = new Dimension();
        d.set(this._preferredWidth.getValue(this._bounds.w), this._preferredHeight.getValue(this._bounds.h));
        this.adjustWithInsets(d);
        var pd = this.getPreferredSize();
        d.width = Math.max(d.width, pd.width);
        d.height = Math.max(d.width, pd.height);
        return d;
    };
    /**
     * @method LayerLayout#doLayout
     */
    LayerLayout.prototype.doLayout = function () {
        var x = this._bounds.x + this._insets.left.getValue(this._bounds.w);
        var y = this._bounds.y + this._insets.top.getValue(this._bounds.h);
        var w = this._bounds.w - this._insets.left.getValue(this._bounds.w) - this._insets.right.getValue(this._bounds.w);
        var h = this._bounds.h - this._insets.top.getValue(this._bounds.h) - this._insets.bottom.getValue(this._bounds.h);
        for (var i = 0; i < this._children.length; i++) {
            this._children[i].setBounds(x, y, w, h);
            this._children[i].doLayout();
        }
    };
    return LayerLayout;
}(BaseLayout));
var LL = (function () {
    function LL() {
    }
    LL.doLayout = function (w, h, layout_def) {
        var bl = BaseLayout.parse(layout_def);
        bl.layout(0, 0, w, h);
        return bl.enumerateLayout();
    };
    return LL;
}());
exports.LL = LL;
//# sourceMappingURL=liquidlayout.js.map