"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ppe = require("ppe");
var s1 = require("./index");
var text = require("./text");
var p5;
var p;
var backgroundColor;
function init(x, y, _backgroundColor) {
    if (x === void 0) { x = 128; }
    if (y === void 0) { y = 128; }
    if (_backgroundColor === void 0) { _backgroundColor = 0; }
    p5 = s1.p5;
    p = s1.p;
    exports.size = new p5.Vector(x, y);
    exports.canvas = p.createCanvas(exports.size.x, exports.size.y).canvas;
    exports.canvas.setAttribute('style', null);
    exports.canvas.setAttribute('id', 'main');
    exports.context = exports.canvas.getContext('2d');
    ppe.options.canvas = exports.canvas;
    text.init(exports.context);
    backgroundColor = _backgroundColor;
}
exports.init = init;
function clear() {
    p.background(backgroundColor);
}
exports.clear = clear;
