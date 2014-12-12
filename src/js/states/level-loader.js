'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js'),
    Memory = require('../managers/memory.js'),
    Loader = require('../utils/loader.js');

function LevelLoader(game) {
    Phaser.State.call(this, game);
}

LevelLoader.prototype = Object.create(Phaser.State.prototype);
LevelLoader.prototype.constructor = LevelLoader;

LevelLoader.prototype.init = function() {
    this.loader = new Loader(this.game);
    this.loader.init(this.game);
};

LevelLoader.prototype.preload = function() {
    this.loader.addLoaderView(this.game);

    var level = Memory.getCurrentLevel();
    var json = Config.assets.levels[level];
    this.loader.queueAssets(this.game, json);
};

LevelLoader.prototype.create = function() {
    this.loader.removeLoaderView();

    this.game.state.start('Level');
};

LevelLoader.prototype.shutdown = function() {
    this.loader.destroy();
};

module.exports = LevelLoader;
