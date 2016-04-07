/**
 * Created by ibon on 4/7/16.
 */
"use strict";
var liquidlayout_1 = require("./liquidlayout");
var rects = liquidlayout_1.LL.doLayout(400, 300, {
    type: "grid",
    columns: 8,
    gap: ["2%", "0"],
    elements: ["elem[1-8]"]
});
for (var key in rects) {
    console.log(key + " =", rects[key]);
}
//# sourceMappingURL=test1.js.map