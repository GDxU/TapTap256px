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
var pag = require("pag");
var sss = require("sss");
var ob = require("../ob/index");
ob.init(init, initGame, update);
var p = ob.p;
var blockSpeed = 0;
var blockAddingDist = 0;
function init() {
    ob.setTitle('IMBALL');
    ob.setSeeds(1959778);
}
function initGame() {
    ob.fillPanel();
    _.times(14, function (i) {
        new ob.Wall(p.createVector(i * 8 + 4 + 9, 4));
    });
    _.times(16, function (i) {
        new ob.Wall(p.createVector(4, i * 8 + 4));
        new ob.Wall(p.createVector(124, i * 8 + 4));
    });
    if (ob.scene !== ob.Scene.title) {
        new Ball();
        new Racket();
    }
    blockSpeed = 0;
    blockAddingDist = 0;
    new ob.DoCond(null, function () {
        new Block();
        blockAddingDist += 10;
    }, function () { return blockAddingDist <= 0; });
}
function update() {
    var d = _.reduce(ob.Actor.get('block'), function (v, b) { return v < b.pos.y ? b.pos.y : v; }, 0);
    blockSpeed = d > 50 ? (1 + ob.getDifficulty()) * 0.03 : (60 - d) * 0.01;
    blockAddingDist -= blockSpeed;
}
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball() {
        var _this = _super.call(this) || this;
        _this.isPressing = false;
        _this.clearModules();
        _this.pixels = pag.generate([' o', 'ox'], { isMirrorX: true, hue: 0.2 });
        _this.pos.set(64, 64);
        var angle = ob.random.get(-p.HALF_PI / 4 * 3, -p.HALF_PI / 2);
        ob.Vector.addAngle(_this.vel, angle, 0.33);
        new ob.ReflectByWall(_this);
        return _this;
    }
    Ball.prototype.update = function () {
        var _this = this;
        if (this.isPressing !== ob.ui.isPressed) {
            this.vel.mult(ob.ui.isPressed ? 4 : 0.25);
            this.isPressing = ob.ui.isPressed;
        }
        if (ob.ui.isJustPressed) {
            this.vel.x *= -1;
        }
        _.forEach(this.testCollision('racket'), function (r) {
            r.adjustPos(_this, 3);
            var ox = _this.pos.x - r.pos.x;
            if (Math.abs(ox) < 8) {
                _this.vel.y *= -1;
            }
            else {
                var speed = _this.vel.mag();
                var angle = ox > 0 ?
                    -p.HALF_PI / 8 * 7 + (ox - 8) / 8 * p.HALF_PI / 2 :
                    -p.HALF_PI / 8 * 9 - (-ox - 8) / 8 * p.HALF_PI / 2;
                _this.vel.set(0, 0);
                ob.Vector.addAngle(_this.vel, angle, speed);
            }
            sss.play('s_ra');
            ob.setScoreMultiplier();
        });
        if (this.pos.y > 128) {
            this.emitParticles('e_bl');
            sss.play('u_bl');
            this.remove();
            ob.endGame();
        }
        this.vel.mult(1.0003);
        _super.prototype.update.call(this);
    };
    return Ball;
}(ob.Actor));
var Racket = /** @class */ (function (_super) {
    __extends(Racket, _super);
    function Racket() {
        var _this = _super.call(this, p.createVector(64, 120), 32, 8, 0.3, 11) || this;
        _this.collisionType = 'racket';
        _this.vel.set(1, 0);
        return _this;
    }
    Racket.prototype.update = function () {
        if (this.pos.x <= 24) {
            this.pos.x = 25;
            this.vel.x *= -1;
        }
        if (this.pos.x >= 128 - 24) {
            this.pos.x = 128 - 25;
            this.vel.x *= -1;
        }
        if (this.testCollision('wall').length > 0) {
            this.emitParticles('e_rk');
            sss.play('u_bl');
            this.remove();
            ob.endGame();
        }
        _super.prototype.update.call(this);
    };
    return Racket;
}(ob.Wall));
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block() {
        var _this = _super.call(this, p.createVector(ob.random.get(16, 112), 0), 16, 8, 0.5, 22) || this;
        _this.type = 'block';
        return _this;
    }
    Block.prototype.update = function () {
        this.pos.y += blockSpeed;
        _super.prototype.update.call(this);
    };
    Block.prototype.destroy = function () {
        this.emitParticles('s_bl');
        sss.play('s_bl');
        ob.addScore(1, this.pos);
        ob.addScoreMultiplier();
        this.remove();
    };
    return Block;
}(ob.Wall));
