"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var pag = require("pag");
var ob = require("./index");
var dotPatterns;
var charToIndex;
var context;
function init(_context) {
    context = _context;
    var letterCount = 66;
    var letterPatterns = [
        0x4644AAA4, 0x6F2496E4, 0xF5646949, 0x167871F4, 0x2489F697,
        0xE9669696, 0x79F99668, 0x91967979, 0x1F799976, 0x1171FF17,
        0xF99ED196, 0xEE444E99, 0x53592544, 0xF9F11119, 0x9DDB9999,
        0x79769996, 0x7ED99611, 0x861E9979, 0x994444E7, 0x46699699,
        0x6996FD99, 0xF4469999, 0x2224F248, 0x26244424, 0x64446622,
        0x84284248, 0x40F0F024, 0x0F0044E4, 0x480A4E40, 0x9A459124,
        0x000A5A16, 0x640444F0, 0x80004049, 0x40400004, 0x44444040,
        0x0AA00044, 0x6476E400, 0xFAFA61D9, 0xE44E4EAA, 0x24F42445,
        0xF244E544, 0x00000042
    ];
    var p = 0;
    var d = 32;
    var pIndex = 0;
    dotPatterns = [];
    for (var i = 0; i < letterCount; i++) {
        var dots = [];
        for (var y = 0; y < 5; y++) {
            for (var x = 0; x < 4; x++) {
                if (++d >= 32) {
                    p = letterPatterns[pIndex++];
                    d = 0;
                }
                if ((p & 1) > 0) {
                    dots.push({ x: x, y: y });
                }
                p >>= 1;
            }
        }
        dotPatterns.push(dots);
    }
    var charStr = "()[]<>=+-*/%&_!?,.:|'\"$@#\\urdl";
    charToIndex = [];
    for (var c = 0; c < 128; c++) {
        var li = -2;
        if (c == 32) {
            li = -1;
        }
        else if (c >= 48 && c < 58) {
            li = c - 48;
        }
        else if (c >= 65 && c < 90) {
            li = c - 65 + 10;
        }
        else {
            var ci = charStr.indexOf(String.fromCharCode(c));
            if (ci >= 0) {
                li = ci + 36;
            }
        }
        charToIndex.push(li);
    }
}
exports.init = init;
var Align;
(function (Align) {
    Align[Align["left"] = 0] = "left";
    Align[Align["right"] = 1] = "right";
})(Align = exports.Align || (exports.Align = {}));
function draw(str, x, y, align) {
    if (align === void 0) { align = null; }
    context.fillStyle = 'white';
    if (align === Align.left) {
    }
    else if (align === Align.right) {
        x -= str.length * 5;
    }
    else {
        x -= str.length * 5 / 2;
    }
    x = Math.floor(x);
    y = Math.floor(y);
    for (var i = 0; i < str.length; i++) {
        var idx = charToIndex[str.charCodeAt(i)];
        if (idx === -2) {
            throw "invalid char: " + str.charAt(i);
        }
        else if (idx >= 0) {
            drawLetter(idx, x, y);
        }
        x += 5;
    }
}
exports.draw = draw;
function drawLetter(idx, x, y) {
    var p = dotPatterns[idx];
    for (var i = 0; i < p.length; i++) {
        var d = p[i];
        context.fillRect(d.x + x, d.y + y, 1, 1);
    }
}
var textPixels = {};
function drawScaled(str, scale, x, y, hue) {
    if (hue === void 0) { hue = null; }
    var pixels = generatePixels(str, scale, hue);
    pag.draw(ob.screen.context, pixels, x, y);
}
exports.drawScaled = drawScaled;
function generatePixels(str, scale, hue) {
    if (hue === void 0) { hue = null; }
    var key = str + "_" + scale + "_" + hue;
    if (textPixels.hasOwnProperty(key)) {
        return textPixels[key];
    }
    var pixelArray = _.times(Math.ceil(5 * scale), function () {
        return _.times(Math.ceil(5 * str.length * scale), function () { return ' '; });
    });
    _.times(str.length, function (i) {
        var idx = charToIndex[str.charCodeAt(i)];
        if (idx === -2) {
            throw "invalid char: " + str.charAt(i);
        }
        else if (idx >= 0) {
            drawToPixelArray(pixelArray, idx, i * 5 * scale, scale);
        }
    });
    var paw = pixelArray[0].length;
    var pah = pixelArray.length;
    _.times(pah, function (y) {
        _.times(paw, function (x) {
            if (pixelArray[y][x] === 'x' && isEdgePixel(x, y, pixelArray, paw, pah)) {
                pixelArray[y][x] = 'o';
            }
        });
    });
    var pagOptions = { isMirrorY: false, scale: 1, rotationNum: 1 };
    if (hue != null) {
        pagOptions.hue = hue;
    }
    if (ob.options.isLimitingColors) {
        pagOptions.colorLighting = 0;
    }
    var pixels = pag.generate(_.map(pixelArray, function (line) { return line.join(''); }), pagOptions);
    textPixels[key] = pixels;
    return pixels;
}
function drawToPixelArray(pixelArray, idx, ox, scale) {
    var p = dotPatterns[idx];
    _.forEach(p, function (d) {
        for (var y = d.y * scale; y < (d.y + 1) * scale; y++) {
            for (var x = d.x * scale; x < (d.x + 1) * scale; x++) {
                pixelArray[Math.round(y)][Math.round(x + ox)] = 'x';
            }
        }
    });
}
function isEdgePixel(x, y, pixelArray, w, h) {
    if (x <= 0 || x >= w - 1 || y <= 0 || y >= h - 1) {
        return true;
    }
    var ofss = [1, 0, 1, 1, 0, 1, -1, 1, -1, 0, -1, -1, 0, -1, 1, -1];
    for (var i = 0; i < 8; i++) {
        if (pixelArray[y + ofss[i * 2 + 1]][x + ofss[i * 2]] === ' ') {
            return true;
        }
    }
    return false;
}
