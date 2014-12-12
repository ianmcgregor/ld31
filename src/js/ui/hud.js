'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js'),
    Dpad = require('../ui/components/dpad.js'),
    Controls = require('../managers/controls.js'),
    Memory = require('../managers/memory.js'),
    TextButton = require('../ui/components/text-button.js');

function Hud(game) {
    Phaser.Group.call(this, game);
}

Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;

Hud.prototype.create = function() {
    this.x = this.y = 0;
    this.fixedToCamera = true;

    this._createScore();
    this._createLives();
    // this._createTouchUI();
};

Hud.prototype._createScore = function() {
    this.score = new Phaser.BitmapText(this.game, 2, 0, Config.font, '', 16);
    this.add(this.score);
};

Hud.prototype._createLives = function() {
    this.lives = this.game.add.group(this);
    for(var i = 0; i < Memory.getLivesLeft(); i++) {
        var life = new Phaser.Image(this.game, this.game.width - 15 - i * 18, 3, 'textures', 'heart_1');
        this.lives.add(life);
    }
    this.lives.setAll('alive', true);
};

Hud.prototype._createTouchUI = function() {
    this.dpad = new Dpad(this.game, 20, Config.height - 110);
    this.add(this.dpad);
    Controls.dpad = this.dpad;

    this.btnA = new TextButton(this.game, 'A', 'textures', 'btn_1_up', 'btn_1_down');
    this.add(this.btnA);
    this.btnA.x = Config.width - 160;
    this.btnA.y = Config.height - 90;
    this.btnA.labelYPressed = 10;
    Controls.btnA = this.btnA;

    this.btnB = new TextButton(this.game, 'B', 'textures', 'btn_2_up', 'btn_2_down');
    this.add(this.btnB);
    this.btnB.x = Config.width - 80;
    this.btnB.y = this.btnA.y;
    this.btnB.labelYPressed = 10;
    Controls.btnB = this.btnB;
};

Hud.prototype.lifeLost = function() {
    var life = this.lives.getFirstAlive();
    if(life) {
        life.alive = false;
        life.frameName = 'heart_2';
    }
};

Hud.prototype.setScore = function(points) {
    this.score.text = Phaser.Utils.pad(points.toString(), 8, '0', 1);
};

Hud.prototype.soundMuted = function() {
    this.soundToggle.setToggle(this.soundToggle.isOff);
    Memory.setSoundOn(this.soundToggle.isOn);

    this.game.sound.mute = !Memory.soundIsOn();
};

Hud.prototype.destroy = function() {
    Phaser.Group.prototype.destroy.apply(this, arguments);
};

module.exports = Hud;
