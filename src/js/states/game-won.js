'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js'),
    Controls = require('../managers/controls.js'),
    Memory = require('../managers/memory.js'),
    UrlParams = require('../utils/url-params.js');

function GameWon(game) {
    Phaser.State.call(this, game);
}

GameWon.prototype = Object.create(Phaser.State.prototype);
GameWon.prototype.constructor = GameWon;

GameWon.prototype.create = function() {
    this.game.add.image(0, 0, 'textures', 'win');

    Memory.resetGame(Config.hero.lives);
    Memory.save();
};

GameWon.prototype.update = function() {
    if (Controls.pointer || Controls.space) {
        this.play();
    }
};

GameWon.prototype.play = function() {
    if(!isNaN(parseFloat(UrlParams.level))) {
        Memory.setCurrentLevel(parseFloat(UrlParams.level));
    }
    this.game.state.start('LevelLoader');
};

GameWon.prototype.shutdown = function() {

};

module.exports = GameWon;
