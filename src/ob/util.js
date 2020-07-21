"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ob = require("./index");
function isIn(v, low, high) {
    return v >= low && v <= high;
}
exports.isIn = isIn;
function wrap(v, low, high) {
    var w = high - low;
    var o = v - low;
    if (o >= 0) {
        return o % w + low;
    }
    else {
        return w + o % w + low;
    }
}
exports.wrap = wrap;
function getDifficulty() {
    return ob.scene === ob.Scene.title ? 1 : ob.ticks * 0.001 + 1;
}
exports.getDifficulty = getDifficulty;
function fillStar(c, minSpeedY, maxSpeedY, minSpeedX, maxSpeedX) {
    if (c === void 0) { c = 64; }
    if (minSpeedY === void 0) { minSpeedY = 0.5; }
    if (maxSpeedY === void 0) { maxSpeedY = 1.5; }
    if (minSpeedX === void 0) { minSpeedX = 0; }
    if (maxSpeedX === void 0) { maxSpeedX = 0; }
    _.times(c, function () { return new ob.Star(minSpeedY, maxSpeedY, minSpeedX, maxSpeedX); });
}
exports.fillStar = fillStar;
function fillPanel() {
    _.times(10, function (x) {
        _.times(10, function (y) {
            new ob.Panel(x * 16 - 8, y * 16 - 8);
        });
    });
}
exports.fillPanel = fillPanel;
function getClassName(obj) {
    return ('' + obj.constructor).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1');
}
exports.getClassName = getClassName;
var Vector = /** @class */ (function () {
    function Vector() {
    }
    Vector.getAngle = function (v, to) {
        if (to === void 0) { to = null; }
        return to == null ? Math.atan2(v.y, v.x) : Math.atan2(to.y - v.y, to.x - v.x);
    };
    Vector.addAngle = function (v, angle, value) {
        v.x += Math.cos(angle) * value;
        v.y += Math.sin(angle) * value;
    };
    Vector.constrain = function (v, lowX, highX, lowY, highY) {
        v.x = ob.p.constrain(v.x, lowX, highX);
        v.y = ob.p.constrain(v.y, lowY, highY);
    };
    Vector.swapXy = function (v) {
        var t = v.x;
        v.x = v.y;
        v.y = t;
    };
    return Vector;
}());
exports.Vector = Vector;
