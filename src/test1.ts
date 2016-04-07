/**
 * Created by ibon on 4/7/16.
 */

import {LL,Rect,LayoutResult} from "./liquidlayout";

var rects : LayoutResult = LL.doLayout( 400, 300, {
                                                      type: "grid",
                                                      columns: 8,
                                                      gap : ["2%","0"],
                                                      elements : [ "elem[1-8]" ]
                                                  } );

for( const key in rects ) {
    console.log( key+" =", rects[key] );
}