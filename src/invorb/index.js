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
var sss = require("sss");
var ob = require("../ob/index");
ob.init(init, initGame, update);
var p = ob.p;
var enemiesCount;
function init() {
    ob.setTitle('INVORB');
    ob.setSeeds(3593533);
}
function initGame() {
    ob.fillStar(64, 0.01, 0.01);
    if (ob.scene !== ob.Scene.title) {
        new Player();
        new Earth();
    }
    enemiesCount = 1;
}
function update() {
    if (ob.Actor.get('enemy').length <= 0) {
        _.times(enemiesCount, function () { return new Enemy(); });
        if (enemiesCount < 16) {
            enemiesCount++;
        }
    }
}
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        var radius = 15;
        _this.msx = new ob.MoveSin(_this, 'pos.x', 64, radius, 0, 0);
        _this.msy = new ob.MoveSin(_this, 'pos.y', 64, radius, 0, -p.HALF_PI);
        _this.collision.set(3, 3);
        return _this;
    }
    Player.prototype.update = function () {
        this.angle = this.msy.angle;
        this.msx.speed = this.msy.speed = ob.ui.isPressed ? 0.1 : 0.02;
        if (ob.ui.isJustPressed) {
            new Shot(this);
        }
        _super.prototype.update.call(this);
    };
    return Player;
}(ob.Player));
var Shot = /** @class */ (function (_super) {
    __extends(Shot, _super);
    function Shot(player) {
        var _this = _super.call(this, player, 1) || this;
        new ob.HaveGravity(_this);
        new ob.LimitInstances(_this, 3);
        return _this;
    }
    return Shot;
}(ob.Shot));
var Earth = /** @class */ (function (_super) {
    __extends(Earth, _super);
    function Earth() {
        var _this = _super.call(this) || this;
        _this.radius = 10;
        _this.hg = new ob.HaveGravity(_this);
        _this.pos.set(64, 64);
        return _this;
    }
    Earth.prototype.update = function () {
        this.hg.mass = 3 * ob.getDifficulty();
        p.fill('#77f');
        p.ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    };
    return Earth;
}(ob.Actor));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super.call(this) || this;
        new ob.HaveGravity(_this);
        var isUpper = ob.random.get() < 0.5;
        _this.pos.set(ob.random.get(32, 96), isUpper ? -8 : 128 + 8);
        _this.vel.set(ob.random.get(0.1, 0.3) * ob.random.getPm(), isUpper ? ob.random.get(0.1) : -ob.random.get(0.1));
        if (ob.random.get() < 0.5) {
            ob.Vector.swapXy(_this.pos);
            ob.Vector.swapXy(_this.vel);
        }
        return _this;
    }
    Enemy.prototype.update = function () {
        this.angle = ob.Vector.getAngle(this.vel);
        _super.prototype.update.call(this);
    };
    Enemy.prototype.destroy = function () {
        sss.play("e_" + this.type + "_d");
        this.emitParticles("e_" + this.type + "_d");
        ob.addScore(Math.floor(this.pos.dist(p.createVector(64, 64))), this.pos);
        this.remove();
    };
    return Enemy;
}(ob.Enemy));
