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
var ob = require("../ob/index");
ob.init(init, initGame);
var p = ob.p;
var player;
function init() {
    ob.setTitle('REFREV');
    ob.setSeeds(8761924);
}
function initGame() {
    ob.fillStar();
    player = new Player();
    if (ob.scene === ob.Scene.title) {
        player.remove();
    }
    enemyMove = new EnemyMove();
    bulletPattern = new BulletPattern();
    new ob.DoInterval(null, function () {
        enemyMove = new EnemyMove();
        bulletPattern = new BulletPattern();
    }, 60 * 5);
    new ob.DoInterval(null, function () {
        new Enemy();
    }, 60, false, true);
}
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.weaponType = 0;
        _this.weaponLevel = 1;
        _this.mr = new ob.MoveRoundTrip(_this, 'pos.x');
        _this.pos.y = 110;
        _this.angle = -p.HALF_PI;
        return _this;
    }
    Player.prototype.update = function () {
        this.mr.speed = ob.ui.isPressed ? 3 : 1;
        if (ob.ui.isJustPressed) {
            switch (this.weaponType) {
                case 0:
                    if (ob.Actor.get('napalm').length < 3) {
                        new Napalm(this, this.weaponLevel);
                    }
                    break;
                case 1:
                    if (ob.Actor.get('laser').length < 1) {
                        new Laser(this.weaponLevel);
                    }
                    break;
                case 2:
                    if (ob.Actor.get('wave').length < 2) {
                        new Wave(this, this.weaponLevel);
                    }
                    break;
            }
        }
        _super.prototype.update.call(this);
    };
    Player.prototype.changeWeapon = function (type) {
        this.weaponType = type;
        if (this.weaponLevel < 10) {
            this.weaponLevel++;
        }
        var name = ['NAPALM', 'LASER', 'WAVE'];
        var nt = new ob.Text(name[type], 60);
        nt.pos.set(this.pos.x, this.pos.y - 4);
        var lt = new ob.Text("LV" + this.weaponLevel, 60);
        lt.pos.set(this.pos.x, this.pos.y + 4);
    };
    return Player;
}(ob.Player));
var Napalm = /** @class */ (function (_super) {
    __extends(Napalm, _super);
    function Napalm(actor, level) {
        var _this = _super.call(this, actor) || this;
        _this.level = level;
        _this.type = 'napalm';
        return _this;
    }
    Napalm.prototype.destroy = function () {
        new Explosion(this, this.level);
        _super.prototype.destroy.call(this);
    };
    return Napalm;
}(ob.Shot));
var Explosion = /** @class */ (function (_super) {
    __extends(Explosion, _super);
    function Explosion(actor, level) {
        var _this = _super.call(this) || this;
        _this.level = level;
        _this.radius = 0;
        _this.colors = ['#7f7', '#070'];
        _this.pos.set(actor.pos);
        _this.collisionType = 'shot';
        _this.priority = 0.3;
        sss.play('e_ex');
        return _this;
    }
    Explosion.prototype.update = function () {
        this.radius += this.ticks < 30 ? 1 + this.level * 0.1 : -1 - this.level * 0.1;
        this.collision.set(this.radius, this.radius);
        p.fill(this.colors[ob.random.getInt(2)]);
        p.ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
        if (this.ticks >= 60) {
            this.remove();
        }
        _super.prototype.update.call(this);
    };
    Explosion.prototype.destroy = function () { };
    return Explosion;
}(ob.Actor));
var Laser = /** @class */ (function (_super) {
    __extends(Laser, _super);
    function Laser(level) {
        var _this = _super.call(this) || this;
        _this.level = level;
        _this.collisionType = 'shot';
        _this.type = 'laser';
        _this.priority = 0.3;
        sss.play('l_ls');
        sss.play('s_ls');
        _this.pos.y = player.pos.y / 2;
        return _this;
    }
    Laser.prototype.update = function () {
        var _this = this;
        this.pos.x = player.pos.x;
        var w = (1 - this.ticks / 30) * (15 + this.level * 1.8);
        if (this.ticks < 11) {
            p.fill('#7f7');
            this.collision.set(w, this.pos.y * 2);
        }
        else {
            if (this.ticks === 11) {
                _.times(16, function (i) {
                    ppe.emit('m_ls', _this.pos.x, player.pos.y / 16 * i, -p.HALF_PI, { hue: 0.4, countScale: 0.5 });
                });
            }
            p.fill('#070');
            this.collision.set(0, 0);
        }
        p.rect(this.pos.x - w / 2, 0, w, player.pos.y);
        if (this.ticks >= 30) {
            this.remove();
        }
        _super.prototype.update.call(this);
    };
    Laser.prototype.destroy = function () { };
    return Laser;
}(ob.Actor));
var Wave = /** @class */ (function (_super) {
    __extends(Wave, _super);
    function Wave(actor, level) {
        var _this = _super.call(this, actor, 3) || this;
        _this.level = level;
        _this.colors = ['#7f7', '#070'];
        _this.type = 'wave';
        _this.pixels = null;
        _this.width = 12 + level * 1.5;
        _this.collision.set(_this.width, 4);
        return _this;
    }
    Wave.prototype.update = function () {
        _super.prototype.update.call(this);
        p.fill(this.colors[ob.random.getInt(2)]);
        p.rect(this.pos.x - this.width / 2, this.pos.y - 2, this.width, 4);
    };
    Wave.prototype.destroy = function () { };
    return Wave;
}(ob.Shot));
var enemyMove;
var bulletPattern;
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super.call(this) || this;
        _this.pos.x = ob.random.get(16, 128 - 16);
        if (enemyMove.isYSin) {
            new ob.MoveSin(_this, 'pos.y', 0, 64, ob.random.get(0.015, 0.03));
        }
        else {
            _this.vel.y = ob.random.get(1, ob.getDifficulty());
        }
        if (enemyMove.isXSin) {
            _this.vel.x = ob.random.get(ob.getDifficulty() - 1) * ob.random.getPm() * 0.5;
        }
        else {
            var w = ob.random.get(ob.getDifficulty() - 1) * 16;
            new ob.MoveSin(_this, 'pos.x', ob.random.get(16 + w, 128 - 16 - w), w, ob.random.get(0.03, 0.05));
        }
        _this.angle = p.HALF_PI;
        _this.bulletPattern = bulletPattern;
        new ob.DoInterval(_this, function (di) {
            if (_this.pos.y < 50) {
                _this.bulletPattern.fire(_this);
            }
        }, 60, true, true);
        return _this;
    }
    Enemy.prototype.destroy = function () {
        if (ob.random.get() < 0.12) {
            new WeaponItem(this.pos);
        }
        _super.prototype.destroy.call(this);
    };
    return Enemy;
}(ob.Enemy));
var EnemyMove = /** @class */ (function () {
    function EnemyMove() {
        this.isYSin = ob.random.get() < 1 / ob.getDifficulty();
        this.isXSin = ob.random.get() > 1 / ob.getDifficulty();
    }
    return EnemyMove;
}());
var BulletPattern = /** @class */ (function () {
    function BulletPattern() {
        this.way = ob.random.getInt(1, ob.getDifficulty());
        this.angle = ob.random.get(ob.getDifficulty() * p.HALF_PI * 0.2);
        this.whip = ob.random.getInt(1, ob.getDifficulty() * 2);
        this.speed = ob.random.get(ob.getDifficulty() * 0.1);
    }
    BulletPattern.prototype.fire = function (actor) {
        var _this = this;
        var a = ob.Vector.getAngle(actor.pos, player.pos);
        var va = 0;
        if (this.way > 1) {
            a += this.angle;
            va = this.angle * 2 / (this.way - 1);
        }
        _.times(this.way, function (i) {
            var s = 1;
            var vs = 0;
            if (_this.whip > 1) {
                s += _this.speed;
                vs = _this.speed * 2 / (_this.whip - 1);
            }
            _.times(_this.whip, function () {
                new Bullet(actor, s * 2, a);
                s -= vs;
            });
            a -= va;
        });
    };
    return BulletPattern;
}());
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(enemy, speed, angle) {
        var _this = _super.call(this, enemy, speed, angle) || this;
        _this.collision.set(4, 4);
        return _this;
    }
    Bullet.prototype.update = function () {
        _super.prototype.update.call(this);
        var ss = this.testCollision('shot');
        if (ss.length > 0) {
            this.emitParticles('e_bl', { sizeScale: 0.5 });
            new Bonus(this.pos);
            this.remove();
            _.forEach(ss, function (s) {
                if (s.type === 'napalm') {
                    s.destroy();
                }
            });
        }
    };
    return Bullet;
}(ob.Bullet));
var Bonus = /** @class */ (function (_super) {
    __extends(Bonus, _super);
    function Bonus(pos) {
        var _this = _super.call(this, pos, p.createVector(0, -1), p.createVector(0, 0.02)) || this;
        _this.clearModules();
        new ob.RemoveWhenOut(_this, 8, null, null, null, 9999);
        new ob.AbsorbPos(_this);
        return _this;
    }
    Bonus.prototype.destroy = function () {
        ob.addScoreMultiplier();
        this.remove();
    };
    return Bonus;
}(ob.Item));
var WeaponItem = /** @class */ (function (_super) {
    __extends(WeaponItem, _super);
    function WeaponItem(pos) {
        var _this = _super.call(this, pos, p.createVector(0, -1), p.createVector(0, 0.02)) || this;
        _this.pixels = pag.generate(['oo', 'ox'], { isMirrorX: true, hue: 0.4, value: 0.5 });
        _this.clearModules();
        new ob.RemoveWhenOut(_this, 8, null, null, null, 9999);
        new ob.AbsorbPos(_this);
        _this.weaponType = ob.random.getInt(3);
        var texts = ['N', 'L', 'W'];
        new ob.DrawText(_this, texts[_this.weaponType]);
        _this.priority = 0.7;
        return _this;
    }
    WeaponItem.prototype.destroy = function () {
        player.changeWeapon(this.weaponType);
        this.remove();
    };
    return WeaponItem;
}(ob.Item));
