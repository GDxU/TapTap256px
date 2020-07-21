"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Random = /** @class */ (function () {
    function Random() {
        this.setSeed();
    }
    Random.prototype.get = function (fromOrTo, to) {
        if (fromOrTo === void 0) { fromOrTo = 1; }
        if (to === void 0) { to = null; }
        if (to == null) {
            to = fromOrTo;
            fromOrTo = 0;
        }
        return this.getToMaxInt() / 0x7fffffff * (to - fromOrTo) + fromOrTo;
    };
    Random.prototype.getInt = function (fromOrTo, to) {
        if (fromOrTo === void 0) { fromOrTo = 1; }
        if (to === void 0) { to = null; }
        return Math.floor(this.get(fromOrTo, to));
    };
    Random.prototype.getPm = function () {
        return this.get(2) * 2 - 1;
    };
    Random.prototype.setSeed = function (v) {
        if (v === void 0) { v = -0x7fffffff; }
        if (v === -0x7fffffff) {
            v = Math.floor(Math.random() * 0x7fffffff);
        }
        this.x = v = 1812433253 * (v ^ (v >> 30));
        this.y = v = 1812433253 * (v ^ (v >> 30)) + 1;
        this.z = v = 1812433253 * (v ^ (v >> 30)) + 2;
        this.w = v = 1812433253 * (v ^ (v >> 30)) + 3;
        return this;
    };
    Random.prototype.getToMaxInt = function () {
        var t = this.x ^ (this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;
        this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
        return this.w;
    };
    return Random;
}());
exports.default = Random;
