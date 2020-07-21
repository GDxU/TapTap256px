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
var ppe = require("ppe");
var sss = require("sss");
var ir = require("ir");
var ob = require("./index");
var p5;
var rotationNum = 16;
var Actor = /** @class */ (function () {
    function Actor() {
        this.pos = new p5.Vector();
        this.vel = new p5.Vector();
        this.prevPos = new p5.Vector();
        this.angle = 0;
        this.speed = 0;
        this.isAlive = true;
        this.priority = 1;
        this.ticks = 0;
        this.collision = new p5.Vector(8, 8);
        this.context = ob.screen.context;
        this.modules = [];
        this.moduleNames = [];
        Actor.add(this);
        this.type = ob.getClassName(this);
        new ob.RemoveWhenInAndOut(this);
    }
    Actor.prototype.update = function () {
        this.prevPos.set(this.pos);
        this.pos.add(this.vel);
        this.pos.x += Math.cos(this.angle) * this.speed;
        this.pos.y += Math.sin(this.angle) * this.speed;
        if (this.pixels != null) {
            this.drawPixels();
        }
        _.forEach(this.modules, function (m) {
            m.update();
        });
        this.ticks++;
    };
    Actor.prototype.remove = function () {
        this.isAlive = false;
    };
    Actor.prototype.destroy = function () {
        this.remove();
    };
    Actor.prototype.clearModules = function () {
        this.modules = [];
        this.moduleNames = [];
    };
    Actor.prototype.testCollision = function (type) {
        var _this = this;
        return _.filter(Actor.getByCollitionType(type), function (a) {
            return Math.abs(_this.pos.x - a.pos.x) < (_this.collision.x + a.collision.x) / 2 &&
                Math.abs(_this.pos.y - a.pos.y) < (_this.collision.y + a.collision.y) / 2;
        });
    };
    Actor.prototype.emitParticles = function (patternName, options) {
        if (options === void 0) { options = {}; }
        ppe.emit(patternName, this.pos.x, this.pos.y, this.angle, options);
    };
    Actor.prototype.drawPixels = function (x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        if (x == null) {
            x = this.pos.x;
        }
        if (y == null) {
            y = this.pos.y;
        }
        if (this.pixels.length <= 1) {
            pag.draw(this.context, this.pixels, x, y);
        }
        else {
            var a = this.angle;
            if (a < 0) {
                a = Math.PI * 2 - Math.abs(a % (Math.PI * 2));
            }
            var ri = Math.round(a / (Math.PI * 2 / rotationNum)) % rotationNum;
            pag.draw(this.context, this.pixels, x, y, ri);
        }
    };
    Actor.prototype.getModule = function (moduleName) {
        return this.modules[_.indexOf(this.moduleNames, moduleName)];
    };
    Actor.prototype._addModule = function (module) {
        this.modules.push(module);
        this.moduleNames.push(ob.getClassName(module));
    };
    Actor.prototype.getReplayStatus = function () {
        if (this.replayPropertyNames == null) {
            return null;
        }
        return ir.objectToArray(this, this.replayPropertyNames);
    };
    Actor.prototype.setReplayStatus = function (status) {
        ir.arrayToObject(status, this.replayPropertyNames, this);
    };
    Actor.init = function () {
        p5 = ob.p5;
        pag.setDefaultOptions({
            isMirrorY: true,
            rotationNum: rotationNum,
            scale: 2
        });
        Actor.clear();
    };
    Actor.add = function (actor) {
        Actor.actors.push(actor);
    };
    Actor.clear = function () {
        Actor.actors = [];
    };
    Actor.updateLowerZero = function () {
        _.sortBy(Actor.actors, 'priority');
        Actor.updateSorted(true);
    };
    Actor.update = function () {
        Actor.updateSorted();
    };
    Actor.updateSorted = function (isLowerZero) {
        if (isLowerZero === void 0) { isLowerZero = false; }
        for (var i = 0; i < Actor.actors.length;) {
            var a = Actor.actors[i];
            if (isLowerZero && a.priority >= 0) {
                return;
            }
            if (!isLowerZero && a.priority < 0) {
                i++;
                continue;
            }
            if (a.isAlive !== false) {
                a.update();
            }
            if (a.isAlive === false) {
                Actor.actors.splice(i, 1);
            }
            else {
                i++;
            }
        }
    };
    Actor.get = function (type) {
        if (type === void 0) { type = null; }
        return type == null ? Actor.actors :
            _.filter(Actor.actors, function (a) { return a.type === type; });
    };
    Actor.getByModuleName = function (moduleName) {
        return _.filter(Actor.actors, function (a) { return _.indexOf(a.moduleNames, moduleName) >= 0; });
    };
    Actor.getByCollitionType = function (collitionType) {
        return _.filter(Actor.actors, function (a) { return a.collisionType == collitionType; });
    };
    Actor.getReplayStatus = function () {
        var status = [];
        _.forEach(Actor.actors, function (a) {
            var array = a.getReplayStatus();
            if (array != null) {
                status.push([a.type, array]);
            }
        });
        return status;
    };
    Actor.setReplayStatus = function (status, actorGeneratorFunc) {
        _.forEach(status, function (s) {
            actorGeneratorFunc(s[0], s[1]);
        });
    };
    return Actor;
}());
exports.Actor = Actor;
// generate a pixel art
// (with the default options {isMirrorY: true, rotationNum: 16, scale: 2})
// each character in the string array of the 1st arg represents a pixel type
// 'x': a body or an edge
// '-': a body or an empty
// 'o': an edge
// '*': a body
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        var lines = "\n---|\n---------|\n--X--|\n--x--|\n--xx---------";
        /*
                  -**      |
          x*       |
          x*       |
               *ooo|
              -xxxx|
         */
        _this.pixels = pag.generate(lines.split("|"), { hue: 0.2 });
        _this.type = _this.collisionType = 'player';
        _this.collision.set(5, 5);
        return _this;
    }
    Player.prototype.update = function () {
        this.emitParticles("t_" + this.type);
        _super.prototype.update.call(this);
        if (this.testCollision('enemy').length > 0 ||
            this.testCollision('bullet').length > 0) {
            this.destroy();
        }
    };
    Player.prototype.destroy = function () {
        sss.play("u_" + this.type + "_d");
        this.emitParticles("e_" + this.type + "_d", { sizeScale: 2 });
        _super.prototype.destroy.call(this);
        ob.endGame();
    };
    return Player;
}(Actor));
exports.Player = Player;
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super.call(this) || this;
        _this.pixels = pag.generate([' xx', 'xxxx'], { hue: 0 });
        _this.type = _this.collisionType = 'enemy';
        return _this;
    }
    Enemy.prototype.update = function () {
        this.emitParticles("t_" + this.type);
        _super.prototype.update.call(this);
        var cs = this.testCollision('shot');
        if (cs.length > 0) {
            this.destroy();
            _.forEach(cs, function (s) {
                s.destroy();
            });
        }
    };
    Enemy.prototype.destroy = function () {
        sss.play("e_" + this.type + "_d");
        this.emitParticles("e_" + this.type + "_d");
        ob.addScore(1, this.pos);
        _super.prototype.destroy.call(this);
    };
    return Enemy;
}(Actor));
exports.Enemy = Enemy;
var Shot = /** @class */ (function (_super) {
    __extends(Shot, _super);
    function Shot(actor, speed, angle) {
        if (speed === void 0) { speed = 2; }
        if (angle === void 0) { angle = null; }
        var _this = _super.call(this) || this;
        _this.pixels = pag.generate(['xxx'], { hue: 0.4 });
        _this.type = _this.collisionType = 'shot';
        _this.pos.set(actor.pos);
        _this.angle = angle == null ? actor.angle : angle;
        _this.speed = speed;
        _this.priority = 0.3;
        return _this;
    }
    Shot.prototype.update = function () {
        if (this.ticks === 0) {
            this.emitParticles("m_" + this.type);
            sss.play("l_" + this.type);
        }
        this.emitParticles("t_" + this.type);
        _super.prototype.update.call(this);
    };
    return Shot;
}(Actor));
exports.Shot = Shot;
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(actor, speed, angle) {
        if (speed === void 0) { speed = 2; }
        if (angle === void 0) { angle = null; }
        var _this = _super.call(this) || this;
        _this.pixels = pag.generate(['xxxx'], { hue: 0.1 });
        _this.type = _this.collisionType = 'bullet';
        _this.pos.set(actor.pos);
        _this.angle = angle == null ? actor.angle : angle;
        _this.speed = speed;
        return _this;
    }
    Bullet.prototype.update = function () {
        if (this.ticks === 0) {
            this.emitParticles("m_" + this.type);
            sss.play("l_" + this.type);
        }
        this.emitParticles("t_" + this.type);
        _super.prototype.update.call(this);
    };
    return Bullet;
}(Actor));
exports.Bullet = Bullet;
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(pos, vel, gravity) {
        if (vel === void 0) { vel = null; }
        if (gravity === void 0) { gravity = null; }
        var _this = _super.call(this) || this;
        _this.gravity = gravity;
        _this.pixels = pag.generate([' o', 'ox'], { isMirrorX: true, hue: 0.25 });
        _this.type = _this.collisionType = 'item';
        _this.pos.set(pos);
        if (vel != null) {
            _this.vel = vel;
        }
        _this.priority = 0.6;
        _this.collision.set(10, 10);
        return _this;
    }
    Item.prototype.update = function () {
        this.vel.add(this.gravity);
        this.vel.mult(0.99);
        this.emitParticles("t_" + this.type);
        _super.prototype.update.call(this);
        if (this.testCollision('player').length > 0) {
            this.emitParticles("s_" + this.type);
            sss.play("s_" + this.type);
            this.destroy();
        }
        _super.prototype.update.call(this);
    };
    Item.prototype.destroy = function () {
        ob.addScore(1, this.pos);
        _super.prototype.destroy.call(this);
    };
    return Item;
}(Actor));
exports.Item = Item;
var Wall = /** @class */ (function (_super) {
    __extends(Wall, _super);
    function Wall(pos, width, height, hue, seed) {
        if (width === void 0) { width = 8; }
        if (height === void 0) { height = 8; }
        if (hue === void 0) { hue = 0.7; }
        if (seed === void 0) { seed = null; }
        var _this = _super.call(this) || this;
        var pw = Math.round(width / 4);
        var ph = Math.round(height / 4);
        var pt = [_.times(pw, function () { return 'o'; }).join('')].concat(_.times(ph - 1, function () { return ['o'].concat(_.times(pw - 1, function () { return 'x'; })).join(''); }));
        _this.pixels = pag.generate(pt, { isMirrorX: true, hue: hue, seed: seed });
        _this.type = _this.collisionType = 'wall';
        _this.pos.set(pos);
        _this.priority = 0.2;
        _this.collision.set(width, height);
        return _this;
    }
    Wall.prototype.getCollisionInfo = function (actor) {
        var angle;
        var wa = Math.atan2(this.collision.y, this.collision.x);
        var a = ob.Vector.getAngle(this.pos, actor.prevPos);
        if (a > Math.PI - wa || a <= -Math.PI + wa) {
            angle = 2;
        }
        else if (a > wa) {
            angle = 1;
        }
        else if (a > -wa) {
            angle = 0;
        }
        else {
            angle = 3;
        }
        return { wall: this, angle: angle, dist: this.pos.dist(actor.prevPos) };
    };
    Wall.prototype.adjustPos = function (actor, angle) {
        switch (angle) {
            case 0:
                actor.pos.x = this.pos.x + (this.collision.x + actor.collision.x) / 2;
                break;
            case 1:
                actor.pos.y = this.pos.y + (this.collision.y + actor.collision.y) / 2;
                break;
            case 2:
                actor.pos.x = this.pos.x - (this.collision.x + actor.collision.x) / 2;
                break;
            case 3:
                actor.pos.y = this.pos.y - (this.collision.y + actor.collision.y) / 2;
                break;
        }
        return angle;
    };
    Wall.prototype.destroy = function () {
    };
    return Wall;
}(Actor));
exports.Wall = Wall;
var Star = /** @class */ (function (_super) {
    __extends(Star, _super);
    function Star(minSpeedY, maxSpeedY, minSpeedX, maxSpeedX) {
        if (minSpeedY === void 0) { minSpeedY = 0.5; }
        if (maxSpeedY === void 0) { maxSpeedY = 1.5; }
        if (minSpeedX === void 0) { minSpeedX = 0; }
        if (maxSpeedX === void 0) { maxSpeedX = 0; }
        var _this = _super.call(this) || this;
        _this.pos.set(ob.p.random(ob.screen.size.x), ob.p.random(ob.screen.size.y));
        _this.vel.set(ob.p.random(minSpeedX, maxSpeedX), ob.p.random(minSpeedY, maxSpeedY));
        _this.clearModules();
        new ob.WrapPos(_this);
        var colorStrs = ['00', '7f', 'ff'];
        _this.color = '#' + _.times(3, function () { return colorStrs[Math.floor(ob.p.random(3))]; }).join('');
        _this.priority = -1;
        return _this;
    }
    Star.prototype.update = function () {
        _super.prototype.update.call(this);
        ob.p.fill(this.color);
        ob.p.rect(Math.floor(this.pos.x), Math.floor(this.pos.y), 1, 1);
    };
    return Star;
}(Actor));
exports.Star = Star;
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel(x, y) {
        var _this = _super.call(this) || this;
        var pagOptions = { isMirrorX: true, value: 0.5, rotationNum: 1 };
        if (ob.options.isLimitingColors) {
            pagOptions.colorLighting = 0;
        }
        _this.pixels = pag.generate(['ooo', 'oxx', 'oxx'], pagOptions);
        _this.pos.set(x, y);
        new ob.WrapPos(_this);
        _this.priority = -1;
        return _this;
    }
    return Panel;
}(Actor));
exports.Panel = Panel;
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(str, duration, align) {
        if (duration === void 0) { duration = 30; }
        if (align === void 0) { align = null; }
        var _this = _super.call(this) || this;
        _this.str = str;
        _this.duration = duration;
        _this.align = align;
        _this.vel.y = -2;
        return _this;
    }
    Text.prototype.update = function () {
        _super.prototype.update.call(this);
        this.vel.mult(0.9);
        ob.text.draw(this.str, this.pos.x, this.pos.y, this.align);
        if (this.ticks >= this.duration) {
            this.remove();
        }
    };
    return Text;
}(Actor));
exports.Text = Text;
