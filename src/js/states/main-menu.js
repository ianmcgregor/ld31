'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js'),
    Controls = require('../managers/controls.js'),
    Memory = require('../managers/memory.js'),
    UrlParams = require('../utils/url-params.js'),
    Sound = require('../managers/sound.js');

function MainMenu(game) {
    Phaser.State.call(this, game);
}

MainMenu.prototype = Object.create(Phaser.State.prototype);
MainMenu.prototype.constructor = MainMenu;

MainMenu.prototype.create = function() {
    this.createChildren();
    this.initializeSound();
    this.loadSavedGame();
    Controls.init(this.game);
};

MainMenu.prototype.createChildren = function() {
    this.game.add.image(0, 0, 'textures', 'title');

    this.instructions = this.game.add.bitmapText(0, 250, Config.font, '', 24);
    this.instructions.align = 'center';
    this.instructions.x = (this.game.width - this.instructions.textWidth) * 0.5;
};

MainMenu.prototype.initializeSound = function() {
    Sound.init(this.game);
    //Sound.music('music');
};

MainMenu.prototype.loadSavedGame = function() {
    if(Config.urlParams.reset && Config.urlParams.reset === 'true') {
        Memory.reset();
    }
    Memory.load();
};

MainMenu.prototype.update = function() {
    if (Controls.pointer || Controls.space) {
        this.play();
    }
};

MainMenu.prototype.play = function() {
    if(!isNaN(parseFloat(UrlParams.level))) {
        Memory.setCurrentLevel(parseFloat(UrlParams.level));
    }
    this.game.state.start('LevelLoader');
};

MainMenu.prototype.shutdown = function() {
};

module.exports = MainMenu;
