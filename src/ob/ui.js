"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sss = require("sss");
var ob = require("./index");
exports.isPressed = false;
exports.isJustPressed = false;
exports._isPressedInReplay = false;
var isCursorDown = false;
function init() {
    document.onmousedown = function (e) {
        isCursorDown = true;
    };
    document.ontouchstart = function (e) {
        e.preventDefault();
        isCursorDown = true;
        sss.playEmpty();
    };
    document.ontouchmove = function (e) {
        e.preventDefault();
    };
    document.onmouseup = function (e) {
        isCursorDown = false;
    };
    document.ontouchend = function (e) {
        e.preventDefault();
        isCursorDown = false;
    };
}
exports.init = init;
function update() {
    var pp = exports.isPressed;
    exports.isPressed = ob.p.keyIsPressed || isCursorDown;
    exports.isJustPressed = (!pp && exports.isPressed);
}
exports.update = update;
function updateInReplay(events) {
    var pp = exports.isPressed;
    exports._isPressedInReplay = ob.p.keyIsPressed || isCursorDown;
    exports.isPressed = events === '1';
    exports.isJustPressed = (!pp && exports.isPressed);
}
exports.updateInReplay = updateInReplay;
function clearJustPressed() {
    exports.isJustPressed = false;
    exports.isPressed = true;
}
exports.clearJustPressed = clearJustPressed;
function getReplayEvents() {
    return exports.isPressed ? '1' : '0';
}
exports.getReplayEvents = getReplayEvents;
