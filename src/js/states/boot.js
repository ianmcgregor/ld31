'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js'),
    Loader = require('../utils/loader.js'),
    ScreenShake = require('../plugins/screen-shake.js'),
    Memory = require('../managers/memory.js');

function Boot(game) {
    Phaser.State.call(this, game);
}

Boot.prototype = Object.create(Phaser.State.prototype);
Boot.prototype.constructor = Boot;

Boot.prototype.init = function() {

    document.documentElement.classList.add(Config.assetSize);

    this.game.input.maxPointers = 1;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.minWidth = Config.width*0.5;
    this.game.scale.minHeight = Config.height*0.5;
    this.game.scale.maxWidth = Config.width*1;
    this.game.scale.maxHeight = Config.height*1;
    this.game.scale.refresh();

    var screenShake = this.game.plugins.add(ScreenShake);
    this.game.plugins.screenShake = screenShake;

    if(Config.mute){
        Memory.setSoundOn(false);
    }
};

Boot.prototype.preload = function() {
    var loader = new Loader();
    loader.queueAssets(this.game, Config.assets.boot);
};

Boot.prototype.create = function() {
    this.game.stage.backgroundColor = Config.backgroundColor;
    this.game.state.start('Preloader');
};

module.exports = Boot;
