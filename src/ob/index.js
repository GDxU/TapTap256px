"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var pag = require("pag");
var ppe = require("ppe");
var sss = require("sss");
var ir = require("ir");
var gcc = require("gcc");
var actor_1 = require("./actor");
var random_1 = require("./random");
exports.Random = random_1.default;
var ui = require("./ui");
exports.ui = ui;
var screen = require("./screen");
exports.screen = screen;
var text = require("./text");
exports.text = text;
var debug = require("./debug");
exports.debug = debug;
var util = require("./util");
__export(require("./util"));
__export(require("./actor"));
__export(require("./modules/index"));
exports.p5 = require('p5');
exports.ticks = 0;
exports.score = 0;
exports.scoreMultiplier = 1;
exports.options = {
    isShowingScore: true,
    isShowingTitle: true,
    isReplayEnabled: true,
    isPlayingBgm: true,
    isLimitingColors: true,
    isEnableCapturing: false,
    screenWidth: 128,
    screenHeight: 128,
    titleScale: 3
};
var initFunc;
var initGameFunc;
var updateFunc;
var postUpdateFunc;
var onSeedChangedFunc;
var title = 'N/A';
var titleCont;
var titleHue;
var isDebugEnabled = false;
var modules = [];
var initialStatus = { r: 0, s: 0 };
var replayScore;
var Scene;
(function (Scene) {
    Scene[Scene["title"] = 0] = "title";
    Scene[Scene["game"] = 1] = "game";
    Scene[Scene["gameover"] = 2] = "gameover";
    Scene[Scene["replay"] = 3] = "replay";
})(Scene = exports.Scene || (exports.Scene = {}));
;
function init(_initFunc, _initGameFunc, _updateFunc, _postUpdateFunc) {
    if (_updateFunc === void 0) { _updateFunc = null; }
    if (_postUpdateFunc === void 0) { _postUpdateFunc = null; }
    initFunc = _initFunc;
    initGameFunc = _initGameFunc;
    updateFunc = _updateFunc;
    postUpdateFunc = _postUpdateFunc;
    exports.random = new random_1.default();
    exports.seedRandom = new random_1.default();
    sss.init();
    ir.setOptions({
        frameCount: -1,
        isRecordingEventsAsString: true
    });
    new exports.p5(function (_p) {
        exports.p = _p;
        exports.p.setup = setup;
        exports.p.draw = draw;
    });
}
exports.init = init;
function setTitle(_title, _titleCont) {
    if (_titleCont === void 0) { _titleCont = null; }
    title = _title;
    titleCont = _titleCont;
    var lc = 0;
    for (var i = 0; i < _title.length; i++) {
        lc += _title.charCodeAt(i);
    }
    titleHue = util.wrap(lc * 0.17, 0, 1);
    var docTitle = title;
    if (titleCont != null) {
        docTitle += ' ' + titleCont;
    }
    document.title = docTitle;
}
exports.setTitle = setTitle;
function enableDebug(_onSeedChangedFunc) {
    if (_onSeedChangedFunc === void 0) { _onSeedChangedFunc = null; }
    onSeedChangedFunc = _onSeedChangedFunc;
    debug.initSeedUi(setSeeds);
    debug.enableShowingErrors();
    isDebugEnabled = true;
}
exports.enableDebug = enableDebug;
function setOptions(_options) {
    for (var attr in _options) {
        exports.options[attr] = _options[attr];
    }
}
exports.setOptions = setOptions;
function setSeeds(seed) {
    pag.setSeed(seed);
    ppe.setSeed(seed);
    ppe.reset();
    sss.reset();
    sss.setSeed(seed);
    if (exports.scene === Scene.game) {
        sss.playBgm();
    }
    if (onSeedChangedFunc != null) {
        onSeedChangedFunc();
    }
}
exports.setSeeds = setSeeds;
function endGame() {
    if (exports.scene === Scene.gameover || exports.scene == Scene.title) {
        return;
    }
    var isReplay = exports.scene === Scene.replay;
    exports.scene = Scene.gameover;
    exports.ticks = 0;
    sss.stopBgm();
    if (!isReplay && exports.options.isReplayEnabled) {
        initialStatus.s = exports.score;
        ir.recordInitialStatus(initialStatus);
        ir.saveAsUrl();
    }
}
exports.endGame = endGame;
function addScore(v, pos) {
    if (v === void 0) { v = 1; }
    if (pos === void 0) { pos = null; }
    if (exports.scene === Scene.game || exports.scene === Scene.replay) {
        exports.score += v * exports.scoreMultiplier;
        if (pos != null) {
            var s = '+';
            if (exports.scoreMultiplier <= 1) {
                s += "" + v;
            }
            else if (v <= 1) {
                s += "" + exports.scoreMultiplier;
            }
            else {
                s += v + "X" + exports.scoreMultiplier;
            }
            var t = new actor_1.Text(s);
            t.pos.set(pos);
        }
    }
}
exports.addScore = addScore;
function addScoreMultiplier(v) {
    if (v === void 0) { v = 1; }
    exports.scoreMultiplier += v;
}
exports.addScoreMultiplier = addScoreMultiplier;
function setScoreMultiplier(v) {
    if (v === void 0) { v = 1; }
    exports.scoreMultiplier = v;
}
exports.setScoreMultiplier = setScoreMultiplier;
function clearModules() {
    modules = [];
}
exports.clearModules = clearModules;
function _addModule(module) {
    modules.push(module);
}
exports._addModule = _addModule;
function setup() {
    exports.p.noStroke();
    exports.p.noSmooth();
    ui.init();
    actor_1.Actor.init();
    initFunc();
    screen.init(exports.options.screenWidth, exports.options.screenHeight);
    if (exports.options.isLimitingColors) {
        limitColors();
    }
    if (exports.options.isEnableCapturing) {
        gcc.setOptions({
            scale: 2
        });
    }
    if (isDebugEnabled || !exports.options.isShowingTitle) {
        beginGame();
    }
    else {
        if (exports.options.isReplayEnabled && ir.loadFromUrl() === true) {
            beginReplay();
        }
        else {
            beginTitle();
            initGameFunc();
        }
    }
}
function beginGame() {
    clearGameStatus();
    exports.scene = Scene.game;
    var seed = exports.seedRandom.getInt(9999999);
    exports.random.setSeed(seed);
    if (exports.options.isReplayEnabled) {
        ir.startRecord();
        initialStatus.r = seed;
    }
    if (exports.options.isPlayingBgm) {
        sss.playBgm();
    }
    initGameFunc();
}
function clearGameStatus() {
    clearModules();
    actor_1.Actor.clear();
    ppe.clear();
    ui.clearJustPressed();
    exports.score = exports.ticks = 0;
    exports.scoreMultiplier = 1;
}
function beginTitle() {
    exports.scene = Scene.title;
    exports.ticks = 0;
}
function beginReplay() {
    if (exports.options.isReplayEnabled) {
        var status_1 = ir.startReplay();
        if (status_1 !== false) {
            clearGameStatus();
            exports.scene = Scene.replay;
            exports.random.setSeed(status_1.r);
            replayScore = status_1.s;
            initGameFunc();
        }
    }
}
function draw() {
    screen.clear();
    handleScene();
    sss.update();
    if (updateFunc != null) {
        updateFunc();
    }
    _.forEach(modules, function (m) {
        m.update();
    });
    actor_1.Actor.updateLowerZero();
    ppe.update();
    actor_1.Actor.update();
    if (postUpdateFunc != null) {
        postUpdateFunc();
    }
    if (exports.options.isShowingScore) {
        text.draw("" + exports.score, 1, 1, text.Align.left);
        if (exports.scoreMultiplier > 1) {
            text.draw("X" + exports.scoreMultiplier, 127, 1, text.Align.right);
        }
    }
    drawSceneText();
    if (exports.options.isEnableCapturing) {
        gcc.capture(screen.canvas);
    }
    exports.ticks++;
}
function handleScene() {
    if ((exports.scene === Scene.title && ui.isJustPressed) ||
        (exports.scene === Scene.replay && ui._isPressedInReplay)) {
        beginGame();
    }
    if (exports.scene === Scene.gameover &&
        (exports.ticks >= 60 || (exports.ticks >= 20 && ui.isJustPressed))) {
        beginTitle();
    }
    if (exports.options.isReplayEnabled && exports.scene === Scene.title && exports.ticks >= 120) {
        beginReplay();
    }
    if (exports.scene === Scene.replay) {
        var events = ir.getEvents();
        if (events !== false) {
            ui.updateInReplay(events);
        }
        else {
            beginTitle();
        }
    }
    else {
        ui.update();
        if (exports.options.isReplayEnabled && exports.scene === Scene.game) {
            ir.recordEvents(ui.getReplayEvents());
        }
    }
}
function drawSceneText() {
    switch (exports.scene) {
        case Scene.title:
            if (titleCont == null) {
                text.drawScaled(title, exports.options.titleScale, screen.size.x / 2, screen.size.y * 0.45, titleHue);
            }
            else {
                text.drawScaled(title, exports.options.titleScale, screen.size.x / 2, screen.size.y * 0.35, titleHue);
                text.drawScaled(titleCont, exports.options.titleScale, screen.size.x / 2, screen.size.y * 0.5, titleHue);
            }
            break;
        case Scene.gameover:
            text.draw('GAME OVER', screen.size.x / 2, screen.size.y * 0.45);
            break;
        case Scene.replay:
            if (exports.ticks < 60) {
                text.draw('REPLAY', screen.size.x / 2, screen.size.y * 0.4);
                text.draw("SCORE:" + replayScore, screen.size.x / 2, screen.size.y * 0.5);
            }
            else {
                text.draw('REPLAY', 0, screen.size.y - 6, text.Align.left);
            }
            break;
    }
}
function limitColors() {
    pag.setDefaultOptions({
        isLimitingColors: true
    });
    ppe.setOptions({
        isLimitingColors: true
    });
}
