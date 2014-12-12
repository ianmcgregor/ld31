'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js'),
    Controls = require('../managers/controls.js'),
    Memory = require('../managers/memory.js'),
    UrlParams = require('../utils/url-params.js');

function GameOver(game) {
    Phaser.State.call(this, game);
}

GameOver.prototype = Object.create(Phaser.State.prototype);
GameOver.prototype.constructor = GameOver;

GameOver.prototype.create = function() {
    this.game.add.image(0, 0, 'textures', 'game_over');

    Memory.resetGame(Config.hero.lives);
    Memory.save();
};

GameOver.prototype.update = function() {
    if (Controls.pointer || Controls.space) {
        this.play();
    }
};

GameOver.prototype.play = function() {
    if(!isNaN(parseFloat(UrlParams.level))) {
        Memory.setCurrentLevel(parseFloat(UrlParams.level));
    }
    this.game.state.start('LevelLoader');
};

GameOver.prototype.shutdown = function() {

};

module.exports = GameOver;
