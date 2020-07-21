"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ob = require("../ob/index");
ob.init(init, initGame);
var p = ob.p;
var isRopePassed;
function init() {
    ob.setOptions({
        screenWidth: 512,
        screenHeight: 512,
    });
    ob.setTitle('LASER ROPE');
    var n = Math.random() * 3593533 + 1000000;
    ob.setSeeds(Math.floor(n));
}
function initGame() {
    ob.fillStar(64, -0.01, -0.01);
    _.times(64, function (i) { return new ob.Wall(p.createVector(i * 8 + 4, 286)); });
    if (ob.scene !== ob.Scene.title) {
        new Player();
    }
    isRopePassed = false;
    new ob.DoCond(null, function () { return new Rope; }, function () { return ob.Actor.get('Rope').length <= 0 || ob.random.get() < 0.005; });
}
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.score = 0;
        _this.text_y_offset = 20;
        _this.pos.set(256, 200);
        _this.angle = -p.HALF_PI;
        _this.jow = new ob.JumpOnWall(_this);
        return _this;
    }
    Player.prototype.update = function () {
        if (this.jow.isOnWall) {
            if (this.jow.wasOnWall) {
                this.score++;
            }
            else {
                ob.addScore(this.score, this.pos);
                if (isRopePassed) {
                    isRopePassed = false;
                    ob.addScoreMultiplier();
                }
                this.score = 0;
            }
        }
        ob.text.draw("" + this.score, this.pos.x, this.pos.y - this.text_y_offset);
        _super.prototype.update.call(this);
    };
    return Player;
}(ob.Player));
var Rope = /** @class */ (function (_super) {
    __extends(Rope, _super);
    function Rope() {
        var _this = _super.call(this) || this;
        _this.removingTicks = 0;
        _this.clearModules();
        var r = ob.random.get(100, 105);
        var s = ob.random.get(0.05, 0.1 * ob.getDifficulty());
        _this.ms = new ob.MoveSin(_this, 'pos.y', 281 - r, r, s, p.HALF_PI);
        _this.collisionType = 'enemy';
        return _this;
    }
    Rope.prototype.update = function () {
        _super.prototype.update.call(this);
        var a = this.ms.angle % p.TWO_PI;
        if (a > p.HALF_PI * 0.8 && a < p.HALF_PI) {
            p.fill('#f00');
            this.collision.set(512, 3);
            isRopePassed = true;
            if (this.ticks > 180) {
                this.removingTicks = 1;
            }
        }
        else {
            p.fill('#fff');
            this.collision.set(0, 0);
        }
        if (a > p.HALF_PI && a < p.HALF_PI * 3) {
            this.priority = 0.8;
        }
        else {
            this.priority = 1.2;
        }
        var w = 4 + Math.cos(a) * 3;
        if (this.removingTicks > 0) {
            w += Math.sin(this.removingTicks * 0.3) * 10;
            if (w <= 0) {
                this.remove();
            }
            this.removingTicks++;
        }
        p.rect(0, this.pos.y - w / 2, 512, Math.round(w));
    };
    return Rope;
}(ob.Actor));
