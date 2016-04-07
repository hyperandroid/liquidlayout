# Liquidlayout

LiquidLayout is an abstract layout system.
It calculates new sizes and position for each element, based on a declarative constraint set and without knowing
anything about the target elements but the layout constraints.
The result of applying a layout will be a Map of strings and Rect objects, being the Map key the element name,
and the value, the calculated layout space.

Example:

```typescript

import {LL,Rect,LayoutResult} from "liquidlayout";

var rects : LayoutResult = LL.doLayout( 400, 300, {
                                                      type: "grid",
                                                      columns: 8,
                                                      gap : ["2%","0"],
                                                      elements : [ 
                                                        "elem1", "elem2", "elem3", "elem4",
                                                        "elem5", "elem6", "elem7", "elem8" 
                                                      ]
                                                  } );
                                         
// 2% of horizontal gap will be calculated relative to the 400 specified as width= (8).         
// rects is a map of objects of the form:
{
  elem1 : { x:   0, y: 0, w: 43, h: 300 },
  elem2 : { x:  51, y: 0, w: 43, h: 300 },
  elem3 : { x: 102, y: 0, w: 43, h: 300 },
  elem4 : { x: 153, y: 0, w: 43, h: 300 },
  elem5 : { x: 204, y: 0, w: 43, h: 300 },
  elem6 : { x: 255, y: 0, w: 43, h: 300 },
  elem7 : { x: 306, y: 0, w: 43, h: 300 },
  elem8 : { x: 357, y: 0, w: 43, h: 300 }
}
```

Easy right? Lets dig into the multiple configuration options.

## What is actually laid out.

You will define something to be laid out by supplying a string (a leaf node on the layout tree) or a whole layout
definition like the one in the previous example (Yes, layouts can be nested yehaw. More on that later).

In the example, you see that eight elements names elem1 .. elem8 will be laid out in a row.
For speeding things up, you can define a regular expression for such like: "elem[1-8]", which will be equivalent
to defining the eight elements in a row. 
The regular expression is very simple, and only allow for number range definitions. Take into account that the layout
system must know in advance what elements are to be laid out, so the expression is expanded into its elements before
the process starts.

## Gap (optional)

For the most basic layouts, there's the need to have fine control over how adjacent elements are going to be taking
over the layout space.
The gap controls this. It is an array of two units, one for horizontal space, and one for vertical space.
This space will be applied to adjacent elements, like separation between two row or two column elements.
Each gap unit is defined as:
+ number, which is an absolute value.
+ <number>px, which is an absolute value for the total horizontal or vertical layout space
+ <number>%, which is a value that will be relatively solved to the currently element's parent layout size. 

valid gap unit definitions are:

+ [5,5]: 5 pixels in horizontal, 5 pixels in vertical
+ [5%,2%]
+ [10,3%]
+ etc.

## Insets (optional)

Insets control how each layout element will apply a margin around it before solving its size constraint.
Insets are defined with 4 units like the ones from gap: [ left, top, right, bottom ].
An example could be:
+ [5%, 2%, 5%, 2%]

## Layout types

Currently there are 3 types of layout types:

### BorderLayout

A BorderLayout object divides the available space in up to 5 different regions as follows:

    +----------------------------+
    |            TOP             |
    +------+-------------+-------+
    | LEFT |             | RIGHT |
    |      |             |       |
    |      |             |       |
    |      |   CENTER    |       |
    |      |             |       |
    |      |             |       |
    |      |             |       |
    +------+-------------+-------+
    |           BOTTOM           |
    +----------------------------+

Since all bounds are dynamically calculated, elements added to a BorderLayout (at any nesting level) must
have preferred size hints.
The gap values will be empty filler values between every elements. Horizontal between left-center center-right
and vertical betweeen top and bottom and all the others.
All Elements (top, left, right, center and bottom) are optional to define. This means that a valid BorderLayout could be:

    +----------------------------+
    |            TOP             |
    +----------------------------+
    |                            |
    |                            |
    |           CENTER           |
    |                            |
    |                            |
    +----------------------------+

or

    +------+----------------+  
    | LEFT |                | 
    |      |                | 
    |      |                | 
    |      |   CENTER       | 
    |      |                | 
    |      |                | 
    |      |                | 
    +------+----------------+ 


The center element will get the remaining space after laying out all the other elements.
The left, right and center elements will get the remaining height after evaluating top and then
bottom elements.

top, left, right, bottom and center can be, at the same time, other layouts.

### GridLayout

A grid layout lays elements out either in rows or columns. 
If rows are specified, the lay out will keep the fixed
number of rows and grow on the number of columns or vice versa, like as follows:

    3 rows                        3 columns
    +------------+-----...        +----------+----------+----------+
    |  elem1     |   elem4        |  elem1   |  elem2   |  elem3   |
    +------------+-----...        +----------+----------+----------+
    |  elem2     |                |  elem4   |          |          |
    +------------+-----...        .          .          .          .
    |  elem3     |                .          .          .          .

## Preferred layout size

## Layout composition

## Layout hinting
