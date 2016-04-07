/**
 * License: see license.txt file.
 */

type UnitValue= number|string;
export type LayoutResult = { [key:string] : Rect };

interface Point {
    /**
     * Point x coordinate.
     * @member Point#x
     * @type {number}
     */
    x : number;
    /**
     * Point y coordinate.
     * @member Point#y
     * @type {number}
     */
    y : number;

}

class Dimension {

    constructor( public width:number=0, public height:number=0 ) {

    }

    set( d:Dimension ) : Dimension;
    set( w:number, h:number ) : Dimension;
    set( w:any, h?:number ) : Dimension {

        if ( typeof w==='number' ) {
            this.width= w;
            this.height=h;
        } else {
            var d : Dimension = <Dimension>w;
            this.width= d.width;
            this.height=d.height;
        }

        return this;
    }

    clone() : Dimension {
        return new Dimension( this.width, this.height );
    }
}

export interface Rect {
    x : number;
    y : number;
    w : number;
    h : number;
}

class Rectangle {

    x1 : number = 0;
    y1 : number = 0;

    constructor(public x:number=0, public y:number=0, public w:number=0, public h:number=0) {
        this.set(x,y,w,h);
    }

    set( x : number, y : number, w : number, h : number ) : Rectangle {
        this.x= x;
        this.y= y;
        this.w= w;
        this.h= h;
        this.x1= x+w;
        this.y1= y+h;

        return this;
    }

    intersectsWith( r:Rectangle ) : boolean {
        return this.intersects(r.x,r.y,r.w,r.h);
    }

    intersects( x:number, y:number, w:number, h:number ) : boolean {

        if ( this.x1 < x ) {
            return false;
        }
        if ( this.y1 < y ) {
            return false;
        }
        if ( this.x >=x+w ) {
            return false;
        }
        if ( this.y >=y+h ) {
            return false;
        }

        return true;
    }

    normalizeBy( w : number, h : number ) : Rectangle {
        this.x/=w;
        this.y/=h;
        this.x1/=w;
        this.y1/=h;
        this.w/=w;
        this.h/=h;

        return this;
    }

    setEmpty() : void {
        this.x=0;
        this.y=0;
        this.x1=0;
        this.y1=0;
        this.w=0;
        this.h=0;
    }

    translate( x:number, y:number ) : Rectangle {
        this.x+=x;
        this.y+=y;
        this.x1+=x;
        this.y1+=y;

        return this;
    }

    isEmpty() : boolean {
        return this.w===0 || this.h===0;
    }

    intersectWith( r : Rectangle ) : Rectangle {

        if ( this.intersectsWith(r) ) {


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
        } else {

            this.setEmpty();
        }

        return this;
    }

    contains( x:number, y:number ) : boolean;
    contains( x:Point ) : boolean;
    contains( x:any, y?:number ) : boolean {

        var tx : number;
        var ty : number;

        if ( typeof x !== "number" ) {
            var v : Point = <Point>x;
            tx= v.x;
            ty= v.y;
        } else {
            tx= x;
            ty= y;
        }

        return tx>=this.x && ty>=this.y && tx<this.x1 && ty<this.y1;
    }

    get width() : number {
        return this.w;
    }

    get height() : number {
        return this.h;
    }

    set width( w:number ) {
        this.w= w;
    }

    set height( h:number ) {
        this.h= h;
    }
}

/**
 * @interface BaseLayoutInitializer
 * @classdesc
 *
 * Initializer object for a common layout.
 *
 */
interface BaseLayoutInitializer {

    /**
     * type of the layout, currently: 'element', 'border', 'grid'
     * @member BaseLayoutInitializer#type
     * @type {string}
     */
    type :              string;

    /**
     * Layout element name
     * @member BaseLayoutInitializer#name
     * @type {string=}
     */
    name? :             string;

    /**
     * Preferred width. Has Unit notation, so values like '10px' or '20%' are valid.
     * @member BaseLayoutInitializer#preferredWidth
     * @type {string=}
     */
    preferredWidth? :   string;

    /**
     * Preferred height. Has Unit notation, so values like '10px' or '20%' are valid.
     * @member BaseLayoutInitializer#preferredHeight
     * @type {string=}
     */
    preferredHeight? :  string;

    /**
     * Element insets.
     * An array of four strings representing insets for: left, top, right, bottom respectively.
     * Unit notation.
     * @member BaseLayoutInitializer#insets
     * @type {Array<string>=}
     */
    insets? :           string[];

    /**
     * Element gap.
     * An array of two strings representing element separation for horizontal and vertical respectively.
     * Unit notation.
     * @member BaseLayoutInitializer#gap
     * @type {Array<string>=}
     */
    gap? :              string[];

    /**
     * Array of other layout initializer objects.
     * @member BaseLayoutInitializer#elements
     * @type {Array<BaseLayoutInitializer>} any layout initializer.
     */
    elements? :         string[] | BaseLayoutInitializer[];
}

/**
 * @interface GridLayoutInitializer
 * @extends BaseLayoutInitializer
 * @classdesc
 *
 * Initializer object for a grid layout
 *
 */
interface GridLayoutInitializer extends BaseLayoutInitializer {

    /**
     * Set the grid to grow in columns every number of rows.
     * @member GridLayoutInitializer#rows
     * @type {number=}
     */
    rows? :     number;

    /**
     * Set the grid to grow in rows every number of columns.
     * @member GridLayoutInitializer#columns
     * @type {number=}
     */
    columns? :  number;
}

/**
 * @interface BorderLayoutInitializer
 * @extends BaseLayoutInitializer
 * @classdesc
 *
 * Initializer for a border layout
 */
interface BorderLayoutInitializer extends BaseLayoutInitializer {

    /**
     * Left element initializer.
     * @member BorderLayoutInitializer#left
     * @type {BaseLayoutInitializer=}
     */
    left? :     BaseLayoutInitializer;

    /**
     * Right element initializer.
     * @member BorderLayoutInitializer#right
     * @type {BaseLayoutInitializer=}
     */
    right? :    BaseLayoutInitializer;

    /**
     * Top element initializer.
     * @member BorderLayoutInitializer#top
     * @type {BaseLayoutInitializer=}
     */
    top? :      BaseLayoutInitializer;

    /**
     * Bottom element initializer.
     * @member BorderLayoutInitializer#bottom
     * @type {BaseLayoutInitializer=}
     */
    bottom? :   BaseLayoutInitializer;

    /**
     * Center element initializer.
     * @member BorderLayoutInitializer#center
     * @type {BaseLayoutInitializer=}
     */
    center? :   BaseLayoutInitializer;
}

export type LayoutInitializer = BaseLayoutInitializer | GridLayoutInitializer | BorderLayoutInitializer;

/**
 * @class Unit
 * @classdesc
 *
 * This class encapsulates a value in a given unit.
 * Currently, it could be a number, or a percentage value.
 * If the value is a percentage, a call to <code>getValue</code> needs a reference value.
 */
class Unit {

    /**
     * Unit value.
     * @member Unit#_orgValue
     * @type {number}
     * @private
     */
    _orgValue:number= 0;

    /**
     * Unit type. Either px, %, or nothing.
     * @member Unit#_orgType
     * @type {string}
     * @private
     */
    _orgType:string= "";

    /**
     * Create a new Unit object instance.
     * @method Unit#constructor
     * @param original {string=} Unit value. if not set, the unit it set to 0.
     */
    constructor( original?:string ) {

        if ( typeof original!=='undefined' ) {
            this.setValue(original);
        }
    }

    /**
     * Set the unit value. For example '2%', '100px', '100'
     * @method Unit#setValue
     * @param original {string}
     */
    setValue( original:UnitValue ) {
        var exp:RegExp= new RegExp("\\d+\\.?\\d*(.*)","gi");
        var m= exp.exec(""+original);
        if ( m ) {
            this._orgType=m[1];
            this._orgValue=parseInt(m[0]);
        }
    }

    /**
     * Get the unit value.
     * If the unit type is percentage, and no reference value is supplied, zero will be returned as value.
     * @method Unit#getValue
     * @param ref {number=} percentage reference value.
     * @returns {number}
     */
    getValue( ref?:number ) {

        switch( this._orgType ) {
            case "":
                return this._orgValue;
            case "px":
                return this._orgValue;
            case "%":
                return typeof ref!=="undefined" ? this._orgValue/100*ref : 0;
        }
    }
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
class Insets {

    /**
     * Layout element left inset Unit.
     * @member Insets#left
     * @type {Unit}
     */
    left: Unit= new Unit();

    /**
     * Layout element top inset Unit.
     * @member Insets#top
     * @type {Unit}
     */
    top: Unit= new Unit();

    /**
     * Layout element right inset Unit.
     * @member Insets#right
     * @type {Unit}
     */
    right: Unit= new Unit();

    /**
     * Layout element bottom inset Unit.
     * @member Insets#bottom
     * @type {Unit}
     */
    bottom: Unit= new Unit();
}

/**
 * @class Gap
 * @classdesc
 *
 * This object describes the separation values between two adjacent layout elements.
 * For example, for a grid, describes the Units to separate the grid elements.
 */
class Gap {

    /**
     * Horizontal gap Unit.
     * @member Gap#horizontal
     * @type {Unit}
     */
    horizontal: Unit= new Unit();

    /**
     * Vertical gap Unit.
     * @member Gap#vertical
     * @type {Unit}
     */
    vertical: Unit= new Unit();
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
export class BaseLayout {

    /**
     * Resulting bounds after applying the layout rules.
     * @member BaseLayout#_bounds
     * @type {Rectangle}
     * @private
     */
    _bounds:Rectangle= null;

    /**
     * The layout insets. Insets will reduce the bounds area by setting a padding for the element.
     * @member BaseLayout#_insets
     * @type {Insets}
     * @private
     */
    _insets : Insets = null;

    /**
     * Separation between each layout elements. Not all layout will use this value.
     * @member BaseLayout#_gap
     * @type {Gap}
     * @private
     */
    _gap : Gap = null;

    /**
     * Array of elements to lay out. Since layouts are nestable, children are layout instances as well.
     * @member BaseLayout#_children
     * @type {Array<BaseLayout>}
     * @private
     */
    _children : BaseLayout[]= [];

    /**
     * Layout preferred width Unit hint.
     * @member BaseLayout#_preferredWidth
     * @type {Unit}
     * @private
     */
    _preferredWidth : Unit= null;

    /**
     * Layout preferred height Unit hint.
     * @member BaseLayout#_preferredHeight
     * @type {Unit}
     * @private
     */
    _preferredHeight: Unit= null;

    /**
     * Optional layout identifier.
     * This is useful so that a node tag or name can be matched against this layout element.
     * @member BaseLayout#_name
     * @type {string}
     * @private
     */
    _name: string= '';

    _parent: BaseLayout = null;

    /**
     * Create a new BaseLayout object instance.
     * Do not create directly, only by subclasses.
     * @method BaseLayout#constructor
     */
    constructor() {
        this._bounds= new Rectangle();
        this._insets= new Insets();
        this._gap= new Gap();
        this._preferredWidth= new Unit();
        this._preferredHeight= new Unit();
    }

    /**
     * Parse a layout initializer object to get a layout element object.
     * @param layout {string|BaseLayoutInitializer} a layout initializer object, or a string.
     *   If a string is set, a BaseLayout object will be used.
     */
    static parse( layout:string|BaseLayoutInitializer ) : BaseLayout {

        if (typeof layout==="string") {
            return new BaseLayout().parse({
                type: 'element',
                name: <string>layout
            });
        } else if (layout.type === "element") {
            return new BaseLayout().parse(layout);
        } else if (layout.type === "border") {
            return new BorderLayout().parse(layout);
        } else if (layout.type === "layer") {
            return new LayerLayout().parse(layout);
        } else if (layout.type === "grid") {
            return new GridLayout().parse(layout);
        } else {
            console.log("unknown layout type: "+layout.type);
        }
    }

    /**
     * Helper method to visually see the layout result.
     * @method BaseLayout#paint
     * @param ctx {CanvasRenderingContext2D}
     */
    paint( ctx:CanvasRenderingContext2D ) {
        //ctx.setTransform(1,0,0,1,0,0);
        ctx.strokeRect( this._bounds.x, this._bounds.y, this._bounds.w, this._bounds.h );
        for( var i=0; i<this._children.length; i++ ) {
            this._children[i].paint(ctx);
        }
    }

    /**
     * Set the layout bounds.
     * @method BaseLayout#setBounds
     * @param x {number}
     * @param y {number}
     * @param w {number}
     * @param h {number}
     */
    setBounds( x:number, y:number, w:number, h:number ) {
        this._bounds.set(x,y,w,h);
    }

    /**
     * Set the layout size.
     * @method BaseLayout#setSize
     * @param w {number}
     * @param h {number}
     */
    setSize( w:number, h:number ) {
        this._bounds.w= w;
        this._bounds.h=h;
    }

    /**
     * Set the layout preferred size Unit hints.
     * @param w {number|string}
     * @param h {number|string}
     */
    setPreferredSize( w:UnitValue, h:UnitValue ) {
        this._preferredWidth.setValue( w );
        this._preferredHeight.setValue( h );
    }

    /**
     * Get the element preferredSize.
     * The size units are evaluated, so if they are percentage, the value is recalculated now again.
     * @method BaseLayout#getPreferredSize
     * @returns {Dimension}
     */
    getPreferredSize() : Dimension {
        return new Dimension(
                this._preferredWidth.getValue( this._parent ? this._parent._bounds.w : this._bounds.w ),
                this._preferredHeight.getValue( this._parent ? this._parent._bounds.h : this._bounds.h ) );
    }

    /**
     * Recursively evaluate the layout elements and get the resulting preferred size.
     * This does not take into account the size constraints, will get the desired size.
     * In this object, the implementation returns the result of the preferredSize Unit hints + Insets.
     * @method BaseLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    getPreferredLayoutSize() : Dimension {
        var ps= this.getPreferredSize();
        this.adjustWithInsets(ps);

        return ps;
    }

    /**
     * Evaluate the layout with the current size constraints. The root layout element bounds will be used
     * as size constraint.
     * @method BaseLayout#doLayout
     */
    doLayout() {

        var d= new Dimension();
        this.adjustWithInsets(d);
        this._bounds.w-= d.width;
        this._bounds.h-= d.height;
        this._bounds.x+= d.width/2;
        this._bounds.y+= d.height/2;
    }

    /**
     * Set size constraints and evaluate the layout.
     * The result will be all layout elements have assigned a bounds.
     * @method BaseLayout#layout
     * @param x {number}
     * @param y {number}
     * @param w {number}
     * @param h {number}
     */
    layout( x:number, y:number, w:number, h:number ) {
        this.setBounds(x,y,w,h);
        this.getPreferredLayoutSize();
        this.doLayout();
    }

    /**
     * Parse a layout definition object.
     * This will get all the common layout properties: insets, gap, preferred size and elements.
     * @method BaseLayout#parse
     * @param layoutInfo {BaseLayoutInitializer}
     * @returns {BaseLayout}
     */
    parse( layoutInfo:BaseLayoutInitializer ) : BaseLayout {

        if ( typeof layoutInfo.insets!=='undefined' ) {

            var arr:UnitValue[]= <UnitValue[]>layoutInfo.insets;
            if ( arr.length!==4 ) {
                console.log("wrong defined insets: "+arr);
            }

            this._insets.left.setValue(layoutInfo.insets[0]);
            this._insets.right.setValue(layoutInfo.insets[2]);
            this._insets.top.setValue(layoutInfo.insets[1]);
            this._insets.bottom.setValue(layoutInfo.insets[3]);
        }

        if ( typeof layoutInfo.gap!=='undefined' ) {

            var arr:UnitValue[]= <UnitValue[]>layoutInfo.gap;
            if ( arr.length!==2 ) {
                console.log("wrong defined gap: "+arr);
            }

            this._gap.horizontal.setValue(layoutInfo.gap[0]);
            this._gap.vertical.setValue(layoutInfo.gap[1]);
        }

        if ( typeof layoutInfo.preferredWidth!=='undefined' ) {
            this._preferredWidth.setValue(layoutInfo.preferredWidth);
        }
        if ( typeof layoutInfo.preferredHeight!=='undefined' ) {
            this._preferredHeight.setValue(layoutInfo.preferredHeight);
        }

        if ( typeof layoutInfo.name!=='undefined' ) {
            this._name= layoutInfo.name;
        }

        if ( typeof layoutInfo.elements!=='undefined' ) {
            if ( Object.prototype.toString.call( layoutInfo.elements ) === '[object Array]' ) {
                this.parseElements(layoutInfo.elements);
            } else {
                console.log("Layout elements block is not array.");
            }
        }
        return this;
    }

    /**
     * Parse the elements block from the layout initializer object.
     * @method BaseLayout#parseElements
     * @param children {Array<object>}
     */
    parseElements( children:Array<any> ) {

        var me= this;

        function addElement( s:string|BaseLayoutInitializer, parent:BaseLayout ) {

            var elem:BaseLayout = BaseLayout.parse(s);
            if (elem) {
                elem._parent= parent;
                me._children.push(elem);
            } else {

            }

        }

        for( var i=0; i<children.length; i++ ) {

            if ( typeof children[i]==='string' ) {

                var elem:string= <string>children[i];

                // is elem of the form text[...] ?
                if ( elem.indexOf('[')!==-1 && elem.indexOf(']')!==-1 ) {
                    var exp= new RegExp("(.*)\\[(.*)\\]","gi");
                    var m= exp.exec( elem );
                    var prefix:string= m[1];
                    var pattern:string[]= m[2].split('-');

                    if ( pattern.length===2 ) {

                        var from:number= parseInt( pattern[0] );
                        var to:number= parseInt( pattern[1] );

                        while( from <= to ) {
                            addElement( prefix+from, this );
                            from++;
                        }

                    } else {
                        /// wrong pattern ?!?!?!?!?
                        console.log("wrong pattern for element by name: "+elem );
                        addElement( elem, this );
                    }
                } else {
                    // not name pattern.
                    addElement( elem, this );
                }

            } else {

                addElement( children[i], this );
            }
        }
    }

    /**
     * Add an element layout to this layout object.
     * @param e {BaseLayout}
     * @param constraint {string=} a constraint to add an element. For example, BorderLayout requires a position hint
     *      to add an element.
     */
    addElement( e:BaseLayout, constraint?:string ) {
        this._children.push(e);
    }

    /**
     * Helper method to add the Inset object value to a Dimension.
     * @method BaseLayout#adjustWithInsets
     * @param d
     */
    adjustWithInsets( d:Dimension ) {
        d.width+= this._insets.left.getValue( this._bounds.w ) + this._insets.right.getValue( this._bounds.w );
        d.height+= this._insets.top.getValue( this._bounds.h ) + this._insets.bottom.getValue( this._bounds.h );
    }

    __getLayout( ) : Rect {

        const r:Rectangle = this._bounds;
        return {
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height
        };
    }

    __enumerateLayout( map : LayoutResult ) : LayoutResult {
        if ( this._name!=="" ) {
            map[this._name] = this.__getLayout();
        }
        
        for( const child of this._children ) {
            child.__enumerateLayout( map );
        }

        return map;
    }

    enumerateLayout() : LayoutResult {

        return this.__enumerateLayout( {} );
    }
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
class BorderLayout extends BaseLayout {

    /**
     * Left layout element.
     * @member BorderLayout#_left
     * @type {BaseLayout}
     * @private
     */
    _left:BaseLayout =    null;

    /**
     * Right layout element.
     * @member BorderLayout#_right
     * @type {BaseLayout}
     * @private
     */
    _right:BaseLayout =   null;

    /**
     * Top layout element.
     * @member BorderLayout#_top
     * @type {BaseLayout}
     * @private
     */
    _top:BaseLayout =     null;

    /**
     * Bottom layout element.
     * @member BorderLayout#_bottom
     * @type {BaseLayout}
     * @private
     */
    _bottom:BaseLayout =  null;

    /**
     * Center layout element.
     * @member BorderLayout#_center
     * @type {BaseLayout}
     * @private
     */
    _center:BaseLayout =  null;

    /**
     * Build a new BorderLayout object instance
     * @method BorderLayout#constructor
     */
    constructor() {
        super();
    }

    /**
     * Get the preferred layout size after recursively applying the layout. The size will be the preferred size,
     * not the actual size.
     * @method BorderLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    getPreferredLayoutSize() : Dimension {

        var ret:Dimension= new Dimension();

        var d:Dimension;

        if ( this._left ) {
            d= this._left.getPreferredLayoutSize();
            ret.width+= d.width + this._gap.horizontal.getValue( this._bounds.w );
            ret.height= Math.max( d.height, ret.height );
        }

        if ( this._right ) {
            d= this._right.getPreferredLayoutSize();
            ret.width+= d.width + this._gap.horizontal.getValue( this._bounds.w );
            ret.height= Math.max( d.height, ret.height );
        }

        if ( this._center ) {
            d= this._center.getPreferredLayoutSize();
            ret.width+= d.width;
            ret.height= Math.max( d.height, ret.height );
        }

        if ( this._top ) {
            d= this._top.getPreferredLayoutSize();
            ret.height+= d.height + this._gap.vertical.getValue( this._bounds.h );
            ret.width= Math.max( ret.width, d.width );
        }

        if ( this._bottom ) {
            d= this._bottom.getPreferredLayoutSize();
            ret.height+= d.height + this._gap.vertical.getValue( this._bounds.h );
            ret.width= Math.max( ret.width, d.width );
        }

        this.adjustWithInsets( d );

        var pd= this.getPreferredSize();
        d.width= Math.max( d.width, pd.width );
        d.height= Math.max( d.width, pd.height );

        return d;
    }

    /**
     * Set the left layout element.
     * @method BorderLayout#left
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    left( e:BaseLayout ) : BorderLayout {
        this._children.push(e);
        this._left= e;
        this._left._parent= this;
        return this;
    }

    /**
     * Set the right layout element.
     * @method BorderLayout#right
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    right( e:BaseLayout ) : BorderLayout {
        this._children.push(e);
        this._right= e;
        this._right._parent= this;
        return this;
    }

    /**
     * Set the top layout element.
     * @method BorderLayout#top
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    top( e:BaseLayout ) : BorderLayout {
        this._children.push(e);
        this._top= e;
        this._top._parent= this;
        return this;
    }

    /**
     * Set the bottom layout element.
     * @method BorderLayout#bottom
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    bottom( e:BaseLayout ) : BorderLayout {
        this._children.push(e);
        this._bottom= e;
        this._bottom._parent= this;
        return this;
    }

    /**
     * Set the center layout element.
     * @method BorderLayout#center
     * @param e {BaseLayout}
     * @returns {BorderLayout}
     */
    center( e:BaseLayout ) : BorderLayout {
        this._children.push(e);
        this._center= e;
        this._center._parent= this;
        return this;
    }

    /**
     * Parse the BorderLayout.
     * @method BorderLayout#parse
     * @param layoutInfo {BorderLayoutInitializer}
     * @returns {BorderLayout}
     */
    parse( layoutInfo:BorderLayoutInitializer ) : BorderLayout {

        super.parse(layoutInfo);

        if ( typeof layoutInfo.left!=="undefined" ) {
            this.left( BaseLayout.parse( layoutInfo.left ) );
        }
        if ( typeof layoutInfo.right!=="undefined" ) {
            this.right( BaseLayout.parse( layoutInfo.right ) );
        }
        if ( typeof layoutInfo.bottom!=="undefined" ) {
            this.bottom( BaseLayout.parse( layoutInfo.bottom ) );
        }
        if ( typeof layoutInfo.top!=="undefined" ) {
            this.top( BaseLayout.parse( layoutInfo.top ) );
        }
        if ( typeof layoutInfo.center!=="undefined" ) {
            this.center( BaseLayout.parse( layoutInfo.center ) );
        }

        return this;
    }

    /**
     * Add an element to the layout. Since this layout only allows for 5 specific elements, an adding constraint
     * must be used.
     * @method BorderLayout#addElement
     * @param e {BaseLayout}
     * @param constraint {string} must exist. a value from 'top','bottom','left','right' or 'center'.
     */
    addElement( e:BaseLayout, constraint:string ) {
        
        switch( constraint ) {
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
    }

    /**
     * Do the actual lay out process. Elements will fit into the previously set element bounds.
     * @method BorderLayout#doLayout
     */
    doLayout() {

        var left= this._bounds.x + this._insets.left.getValue( this._bounds.w );
        var top= this._bounds.y + this._insets.top.getValue( this._bounds.h );
        var right= this._bounds.x1 - this._insets.right.getValue( this._bounds.w );
        var bottom= this._bounds.y1 - this._insets.bottom.getValue( this._bounds.h );

        var d:Dimension;

        if ( this._top ) {
            this._top.setSize(right - left, this._top._bounds.h);
            d = this._top.getPreferredLayoutSize();
            this._top._bounds.set( left, top, right-left, d.height );
            this._top.doLayout();
            top+= d.height + this._gap.vertical.getValue( this._bounds.h );
        }
        if ( this._bottom ) {
            this._bottom.setSize(right - left, this._bottom._bounds.h);
            d = this._bottom.getPreferredLayoutSize();
            d.height= Math.min( d.height, bottom-top );
            this._bottom._bounds.set(left, bottom - d.height, right-left, d.height);
            this._bottom.doLayout( );
            bottom-= d.height + this._gap.vertical.getValue( this._bounds.h );
        }
        if ( this._right ) {
            this._right.setSize(this._right._bounds.w, bottom - top);
            d = this._right.getPreferredLayoutSize();
            this._right._bounds.set(right - d.width, top, d.width, bottom-top);
            this._right.doLayout( );
            right-= d.width + this._gap.horizontal.getValue( this._bounds.w );
        }
        if ( this._left ) {
            this._left.setSize(this._left._bounds.w, bottom - top);
            d = this._left.getPreferredLayoutSize();
            d.width= Math.min( d.width, right-left );
            this._left._bounds.set(left, top, d.width, bottom-top );
            this._left.doLayout();
            left+= d.width + this._gap.horizontal.getValue( this._bounds.w );
        }
        if ( this._center ) {
            this._center._bounds.set(left, top, right-left, bottom-top);
            this._center.doLayout( );
        }

    }
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
class GridLayout extends BaseLayout {

    /**
     * Lay out in rows or columns.
     * @member GridLayout#_layoutRows
     * @type {boolean}
     * @private
     */
    _layoutRows:boolean= false;

    /**
     * Elements to layout before adding a row or column.
     * @member GridLayout#_numElements
     * @type {number}
     * @private
     */
    _numElements:number= 0;

    /**
     * Calculated number of rows for the current added elements.
     * @member GridLayout#_rows
     * @type {number}
     * @private
     */
    _rows:number= 0;

    /**
     * Calculated number of columns for the current added elements.
     * @member GridLayout#_columns
     * @type {number}
     * @private
     */
    _columns:number= 0;

    /**
     * Create a new GridLayout object instance.
     * @method GridLayout#constructor
     */
    constructor() {
        super();
    }

    /**
     * Parse the grid info.
     * @method GridLayout#parse
     * @param layoutInfo {GridLayoutInitializer}
     * @returns {GridLayout}
     */
    parse( layoutInfo:GridLayoutInitializer ) : GridLayout {
        super.parse(layoutInfo);

        if ( typeof layoutInfo.rows!=='undefined' ) {
            this._layoutRows= true;
            this._numElements= <number>layoutInfo.rows;
        }

        if ( typeof layoutInfo.columns!=='undefined' ) {
            this._layoutRows= false;
            this._numElements= <number>layoutInfo.columns;
        }

        if ( !this._numElements ) {
            throw "bug bug grid info wrong defined.";
        }

        return this;
    }

    /**
     * Get the preferred layout elements size. The preferred size will be the adjusted to the biggest element's
     * preferred size, adding the gap for each of the layout elements.
     * Finally, the insets will be added to the size.
     * @method GridLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    getPreferredLayoutSize() : Dimension {

        var rows=0;
        var columns=0;

        var ret= new Dimension();

        if ( this._layoutRows ) {
            rows= this._numElements;
            columns= ((rows + this._children.length - 1)/rows)>>0;

        } else {
            columns= this._numElements;
            rows= ((columns + this._children.length - 1)/columns)>>0;
        }

        for( var i=0; i<this._children.length; i++ ) {

            var d= this._children[i].getPreferredLayoutSize();
            if ( d.width > ret.width ) {
                ret.width= d.width;
            }
            if ( d.height > ret.height ) {
                ret.height= d.height;
            }
        }



        this.adjustWithInsets(d);

        d.width+=  columns * ret.width  + (columns - 1) * this._gap.horizontal.getValue( this._bounds.w );
        d.height+= rows    * ret.height + (rows - 1)    * this._gap.vertical.getValue(   this._bounds.h );

        var pd= this.getPreferredSize();
        d.width= Math.max( d.width, pd.width );
        d.height= Math.max( d.height, pd.height );


        this._rows= rows;
        this._columns= columns;

        return d;
    }

    /**
     * Do the actual elements lay out. The size of each element will be constrained to the element's bound.
     * @method GridLayout#doLayout
     */
    doLayout() {


        if (!this._children.length) {
            return;
        }

        var rows : number;
        var columns : number;

        if ( this._layoutRows ) {
            rows= this._numElements;
            columns= ((rows + this._children.length - 1)/rows)>>0;

        } else {
            columns= this._numElements;
            rows= ((columns + this._children.length - 1)/columns)>>0;
        }

        this._rows= rows;
        this._columns= columns;

        var nrows = this._rows;
        var ncols = this._columns;

        var totalGapsWidth = (ncols - 1) * this._gap.horizontal.getValue( this._bounds.w );
        var widthWOInsets = this._bounds.w - (this._insets.left.getValue( this._bounds.w ) + this._insets.right.getValue( this._bounds.w ) );
        var widthOnComponent = ((widthWOInsets - totalGapsWidth) / ncols);  // floor
        var extraWidthAvailable = ((widthWOInsets - (widthOnComponent * ncols + totalGapsWidth)) / 2); // floor

        var totalGapsHeight = (nrows - 1) * this._gap.vertical.getValue( this._bounds.h );
        var heightWOInsets = this._bounds.h - (this._insets.top.getValue( this._bounds.h ) + this._insets.bottom.getValue(this._bounds.h));
        var heightOnComponent = ((heightWOInsets - totalGapsHeight) / nrows); // floor
        var extraHeightAvailable = ((heightWOInsets - (heightOnComponent * nrows + totalGapsHeight)) / 2); // floor

        for (var c = 0, x = this._insets.left.getValue( this._bounds.w ) + extraWidthAvailable;
                c < ncols;
                c++, x += widthOnComponent + this._gap.horizontal.getValue( this._bounds.w ) ) {

            for (var r = 0, y = this._insets.top.getValue( this._bounds.h ) + extraHeightAvailable;
                    r < nrows;
                    r++, y += heightOnComponent + this._gap.vertical.getValue( this._bounds.h ) ) {

                var i = r * ncols + c;
                if (i < this._children.length) {
                    var child = this._children[i];
                    if (null !== child) {
                        child.setBounds(this._bounds.x + x, this._bounds.y + y, widthOnComponent, heightOnComponent);
                        child.doLayout( );
                    }
                }
            }
        }

    }
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
class LayerLayout extends BaseLayout {

    /**
     * Build a new LayerLayout
     * @method LayerLayout#constructor
     */
    constructor() {
        super();
    }

    /**
     * @method LayerLayout#getPreferredLayoutSize
     * @returns {Dimension}
     */
    getPreferredLayoutSize() : Dimension {
        var d= new Dimension();

        d.set( this._preferredWidth.getValue( this._bounds.w ), this._preferredHeight.getValue( this._bounds.h ) );
        this.adjustWithInsets( d );

        var pd= this.getPreferredSize();
        d.width= Math.max( d.width, pd.width );
        d.height= Math.max( d.width, pd.height );

        return d;
    }

    /**
     * @method LayerLayout#doLayout
     */
    doLayout() {

        var x= this._bounds.x + this._insets.left.getValue( this._bounds.w );
        var y= this._bounds.y + this._insets.top.getValue( this._bounds.h );
        var w= this._bounds.w - this._insets.left.getValue( this._bounds.w ) - this._insets.right.getValue( this._bounds.w );
        var h= this._bounds.h -this._insets.top.getValue( this._bounds.h ) - this._insets.bottom.getValue( this._bounds.h );

        for( var i=0; i<this._children.length; i++ ) {
            this._children[i].setBounds( x,y,w,h );
            this._children[i].doLayout( );
        }
    }
}

export class LL {

    static doLayout(w:number, h:number, layout_def:LayoutInitializer):LayoutResult {
        const bl = BaseLayout.parse(layout_def);
        bl.layout(0, 0, w, h);

        return bl.enumerateLayout();
    }
}
