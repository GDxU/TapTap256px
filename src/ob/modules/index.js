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
var ob = require("../index");
var sss = require("sss");
var ppe = require("ppe");
var Module = /** @class */ (function () {
    function Module(actor) {
        this.actor = actor;
        if (actor == null) {
            ob._addModule(this);
        }
        else {
            actor._addModule(this);
        }
    }
    return Module;
}());
var DoInterval = /** @class */ (function (_super) {
    __extends(DoInterval, _super);
    function DoInterval(actor, func, interval, isStartRandomized, isChangedByDifficulty) {
        if (interval === void 0) { interval = 60; }
        if (isStartRandomized === void 0) { isStartRandomized = false; }
        if (isChangedByDifficulty === void 0) { isChangedByDifficulty = false; }
        var _this = _super.call(this, actor) || this;
        _this.func = func;
        _this.interval = interval;
        _this.isChangedByDifficulty = isChangedByDifficulty;
        _this.isEnabled = true;
        _this.ticks = isStartRandomized ? ob.random.getInt(interval) : interval;
        return _this;
    }
    DoInterval.prototype.update = function () {
        this.ticks--;
        if (this.ticks <= 0) {
            if (this.isEnabled) {
                this.func(this);
            }
            var i = this.interval;
            if (this.isChangedByDifficulty) {
                i /= ob.getDifficulty();
            }
            this.ticks += i;
        }
    };
    return DoInterval;
}(Module));
exports.DoInterval = DoInterval;
var DoCond = /** @class */ (function (_super) {
    __extends(DoCond, _super);
    function DoCond(actor, func, cond) {
        var _this = _super.call(this, actor) || this;
        _this.func = func;
        _this.cond = cond;
        _this.isEnabled = true;
        return _this;
    }
    DoCond.prototype.update = function () {
        if (this.isEnabled && this.cond(this)) {
            this.func(this);
        }
    };
    return DoCond;
}(Module));
exports.DoCond = DoCond;
var RemoveWhenOut = /** @class */ (function (_super) {
    __extends(RemoveWhenOut, _super);
    function RemoveWhenOut(actor, padding, paddingRight, paddingBottom, paddingLeft, paddingTop) {
        if (padding === void 0) { padding = 8; }
        if (paddingRight === void 0) { paddingRight = null; }
        if (paddingBottom === void 0) { paddingBottom = null; }
        if (paddingLeft === void 0) { paddingLeft = null; }
        if (paddingTop === void 0) { paddingTop = null; }
        var _this = _super.call(this, actor) || this;
        _this.paddingRight = paddingRight;
        _this.paddingBottom = paddingBottom;
        _this.paddingLeft = paddingLeft;
        _this.paddingTop = paddingTop;
        if (_this.paddingRight == null) {
            _this.paddingRight = padding;
        }
        if (_this.paddingBottom == null) {
            _this.paddingBottom = padding;
        }
        if (_this.paddingLeft == null) {
            _this.paddingLeft = padding;
        }
        if (_this.paddingTop == null) {
            _this.paddingTop = padding;
        }
        return _this;
    }
    RemoveWhenOut.prototype.update = function () {
        if (!ob.isIn(this.actor.pos.x, -this.paddingLeft, ob.screen.size.x + this.paddingRight) ||
            !ob.isIn(this.actor.pos.y, -this.paddingTop, ob.screen.size.y + this.paddingBottom)) {
            this.actor.remove();
        }
    };
    return RemoveWhenOut;
}(Module));
exports.RemoveWhenOut = RemoveWhenOut;
var RemoveWhenInAndOut = /** @class */ (function (_super) {
    __extends(RemoveWhenInAndOut, _super);
    function RemoveWhenInAndOut(actor, padding, paddingRight, paddingBottom, paddingLeft, paddingTop) {
        if (padding === void 0) { padding = 8; }
        if (paddingRight === void 0) { paddingRight = null; }
        if (paddingBottom === void 0) { paddingBottom = null; }
        if (paddingLeft === void 0) { paddingLeft = null; }
        if (paddingTop === void 0) { paddingTop = null; }
        var _this = _super.call(this, actor, padding, paddingRight, paddingBottom, paddingLeft, paddingTop) || this;
        _this.isIn = false;
        _this.paddingOuter = 64;
        return _this;
    }
    RemoveWhenInAndOut.prototype.update = function () {
        if (this.isIn) {
            return _super.prototype.update.call(this);
        }
        if (ob.isIn(this.actor.pos.x, -this.paddingLeft, ob.screen.size.x + this.paddingRight) &&
            ob.isIn(this.actor.pos.y, -this.paddingTop, ob.screen.size.y + this.paddingBottom)) {
            this.isIn = true;
        }
        if (!ob.isIn(this.actor.pos.x, -this.paddingOuter, ob.screen.size.x + this.paddingOuter) ||
            !ob.isIn(this.actor.pos.y, -this.paddingOuter, ob.screen.size.y + this.paddingOuter)) {
            this.actor.remove();
        }
    };
    return RemoveWhenInAndOut;
}(RemoveWhenOut));
exports.RemoveWhenInAndOut = RemoveWhenInAndOut;
var WrapPos = /** @class */ (function (_super) {
    __extends(WrapPos, _super);
    function WrapPos(actor, padding) {
        if (padding === void 0) { padding = 8; }
        var _this = _super.call(this, actor) || this;
        _this.padding = padding;
        return _this;
    }
    WrapPos.prototype.update = function () {
        this.actor.pos.x =
            ob.wrap(this.actor.pos.x, -this.padding, ob.screen.size.x + this.padding);
        this.actor.pos.y =
            ob.wrap(this.actor.pos.y, -this.padding, ob.screen.size.y + this.padding);
    };
    return WrapPos;
}(Module));
exports.WrapPos = WrapPos;
var MoveSin = /** @class */ (function (_super) {
    __extends(MoveSin, _super);
    function MoveSin(actor, prop, center, amplitude, speed, startAngle) {
        if (center === void 0) { center = 64; }
        if (amplitude === void 0) { amplitude = 48; }
        if (speed === void 0) { speed = 0.1; }
        if (startAngle === void 0) { startAngle = 0; }
        var _this = _super.call(this, actor) || this;
        _this.center = center;
        _this.amplitude = amplitude;
        _this.speed = speed;
        _this.prop = getPropValue(actor, prop);
        _this.prop.value[_this.prop.name] = _this.center;
        _this.angle = startAngle;
        return _this;
    }
    MoveSin.prototype.update = function () {
        this.angle += this.speed;
        this.prop.value[this.prop.name] = Math.sin(this.angle) * this.amplitude + this.center;
    };
    return MoveSin;
}(Module));
exports.MoveSin = MoveSin;
var MoveRoundTrip = /** @class */ (function (_super) {
    __extends(MoveRoundTrip, _super);
    function MoveRoundTrip(actor, prop, center, width, speed, startVel) {
        if (center === void 0) { center = 64; }
        if (width === void 0) { width = 48; }
        if (speed === void 0) { speed = 1; }
        if (startVel === void 0) { startVel = 1; }
        var _this = _super.call(this, actor) || this;
        _this.center = center;
        _this.width = width;
        _this.speed = speed;
        _this.prop = getPropValue(actor, prop);
        _this.prop.value[_this.prop.name] = _this.center;
        _this.vel = startVel;
        return _this;
    }
    MoveRoundTrip.prototype.update = function () {
        this.prop.value[this.prop.name] += this.vel * this.speed;
        if ((this.vel > 0 && this.prop.value[this.prop.name] > this.center + this.width) ||
            (this.vel < 0 && this.prop.value[this.prop.name] < this.center - this.width)) {
            this.vel *= -1;
            this.prop.value[this.prop.name] += this.vel * this.speed * 2;
        }
    };
    return MoveRoundTrip;
}(Module));
exports.MoveRoundTrip = MoveRoundTrip;
var MoveTo = /** @class */ (function (_super) {
    __extends(MoveTo, _super);
    function MoveTo(actor, ratio) {
        if (ratio === void 0) { ratio = 0.1; }
        var _this = _super.call(this, actor) || this;
        _this.ratio = ratio;
        _this.targetPos = ob.p.createVector();
        return _this;
    }
    MoveTo.prototype.update = function () {
        this.actor.pos.x += (this.targetPos.x - this.actor.pos.x) * this.ratio;
        this.actor.pos.y += (this.targetPos.y - this.actor.pos.y) * this.ratio;
    };
    return MoveTo;
}(Module));
exports.MoveTo = MoveTo;
var AbsorbPos = /** @class */ (function (_super) {
    __extends(AbsorbPos, _super);
    function AbsorbPos(actor, type, dist) {
        if (type === void 0) { type = 'player'; }
        if (dist === void 0) { dist = 32; }
        var _this = _super.call(this, actor) || this;
        _this.type = type;
        _this.dist = dist;
        _this.absorbingTicks = 0;
        return _this;
    }
    AbsorbPos.prototype.update = function () {
        var absorbingTos = ob.Actor.get(this.type);
        if (absorbingTos.length > 0) {
            var to = absorbingTos[0];
            if (this.absorbingTicks > 0) {
                var r = this.absorbingTicks * 0.01;
                this.actor.pos.x += (to.pos.x - this.actor.pos.x) * r;
                this.actor.pos.y += (to.pos.y - this.actor.pos.y) * r;
                this.absorbingTicks++;
            }
            else if (this.actor.pos.dist(to.pos) < this.dist) {
                this.absorbingTicks = 1;
            }
        }
    };
    return AbsorbPos;
}(Module));
exports.AbsorbPos = AbsorbPos;
var HaveGravity = /** @class */ (function (_super) {
    __extends(HaveGravity, _super);
    function HaveGravity(actor, mass) {
        if (mass === void 0) { mass = 0.1; }
        var _this = _super.call(this, actor) || this;
        _this.mass = mass;
        _this.velocity = 0.01;
        return _this;
    }
    HaveGravity.prototype.update = function () {
        var _this = this;
        _.forEach(ob.Actor.getByModuleName('HaveGravity'), function (a) {
            if (a === _this.actor) {
                return;
            }
            var r = ob.wrap(a.pos.dist(_this.actor.pos), 1, 999) * 0.1;
            var v = (a.getModule('HaveGravity').mass * _this.mass) / r / r /
                _this.mass * _this.velocity;
            var an = ob.Vector.getAngle(_this.actor.pos, a.pos);
            ob.Vector.addAngle(_this.actor.vel, an, v);
        });
    };
    return HaveGravity;
}(Module));
exports.HaveGravity = HaveGravity;
var LimitInstances = /** @class */ (function () {
    function LimitInstances(actor, count) {
        if (count === void 0) { count = 1; }
        if (ob.Actor.get(actor.type).length > count) {
            actor.remove();
        }
    }
    return LimitInstances;
}());
exports.LimitInstances = LimitInstances;
var JumpOnWall = /** @class */ (function (_super) {
    __extends(JumpOnWall, _super);
    function JumpOnWall(actor, jumpVel, fallFastVel, fallSlowVel, fallRatio) {
        if (jumpVel === void 0) { jumpVel = 5; }
        if (fallFastVel === void 0) { fallFastVel = 10; }
        if (fallSlowVel === void 0) { fallSlowVel = 1; }
        if (fallRatio === void 0) { fallRatio = 0.04; }
        var _this = _super.call(this, actor) || this;
        _this.jumpVel = jumpVel;
        _this.fallFastVel = fallFastVel;
        _this.fallSlowVel = fallSlowVel;
        _this.fallRatio = fallRatio;
        _this.isOnWall = false;
        _this.wasOnWall = false;
        return _this;
    }
    JumpOnWall.prototype.update = function () {
        var _this = this;
        var wasOnWall = this.wasOnWall;
        this.wasOnWall = this.isOnWall;
        this.isOnWall = false;
        var collisionInfo = { dist: 999 };
        _.forEach(this.actor.testCollision('wall'), function (w) {
            var ci = w.getCollisionInfo(_this.actor);
            if (ci.dist < collisionInfo.dist) {
                collisionInfo = ci;
            }
            _this.isOnWall = true;
        });
        if (this.isOnWall) {
            collisionInfo.wall.adjustPos(this.actor, collisionInfo.angle);
            if (!wasOnWall) {
                sss.play("s_" + this.actor.type + "_jow");
            }
            if (ob.ui.isJustPressed) {
                this.actor.vel.y = -this.jumpVel;
                ppe.emit("m_" + this.actor.type + "_jow", this.actor.pos.x, this.actor.pos.y, 0);
                ppe.emit("m_" + this.actor.type + "_jow", this.actor.pos.x, this.actor.pos.y, Math.PI);
                sss.play("j_" + this.actor.type + "_jow");
            }
            else {
                this.actor.vel.y = 1;
            }
        }
        else {
            var avy = ob.ui.isPressed ? this.fallSlowVel : this.fallFastVel;
            this.actor.vel.y += (avy - this.actor.vel.y) * this.fallRatio;
        }
    };
    return JumpOnWall;
}(Module));
exports.JumpOnWall = JumpOnWall;
var ReflectByWall = /** @class */ (function (_super) {
    __extends(ReflectByWall, _super);
    function ReflectByWall(actor) {
        return _super.call(this, actor) || this;
    }
    ReflectByWall.prototype.update = function () {
        var _this = this;
        var collisionInfo = { dist: 999 };
        _.forEach(this.actor.testCollision('wall'), function (w) {
            var ci = w.getCollisionInfo(_this.actor);
            if (ci.dist < collisionInfo.dist) {
                collisionInfo = ci;
            }
        });
        if (collisionInfo.wall == null) {
            return;
        }
        collisionInfo.wall.adjustPos(this.actor, collisionInfo.angle);
        if (collisionInfo.angle === 0 || collisionInfo.angle === 2) {
            this.actor.vel.x *= -1;
        }
        if (collisionInfo.angle === 1 || collisionInfo.angle === 3) {
            this.actor.vel.y *= -1;
        }
        collisionInfo.wall.destroy();
    };
    return ReflectByWall;
}(Module));
exports.ReflectByWall = ReflectByWall;
var DrawText = /** @class */ (function (_super) {
    __extends(DrawText, _super);
    function DrawText(actor, text) {
        var _this = _super.call(this, actor) || this;
        _this.text = text;
        return _this;
    }
    DrawText.prototype.update = function () {
        ob.text.draw(this.text, this.actor.pos.x + 1, this.actor.pos.y - 3);
    };
    return DrawText;
}(Module));
exports.DrawText = DrawText;
function getPropValue(obj, prop) {
    var value = obj;
    var name;
    var ps = prop.split('.');
    _.forEach(ps, function (p, i) {
        if (i < ps.length - 1) {
            value = value[p];
        }
        else {
            name = p;
        }
    });
    return { value: value, name: name };
}
