'use strict';

var Config = require('../config/config.js'),
    Spinner = require('../ui/components/spinner.js');

function Loader() {
    this.queueActions = {
        images: this.queueImage,
        sounds: this.queueSound,
        atlases: this.queueAtlas,
        spritesheets: this.queueSpritesheet,
        tilemaps: this.queueTilemap,
        fonts: this.queueFont,
        data: this.queueData
    };
}

Loader.prototype.init = function(game) {
    this.game = game;
    this.progressBar = null;
    this.animation = null;

    game.load.crossOrigin = 'anonymous';
    game.load.onFileComplete.removeAll();
    game.load.onFileError.removeAll();
    game.load.onFileComplete.add(this.fileLoaded, this);
    game.load.onFileError.add(this.fileError, this);
};

Loader.prototype.addLoaderView = function() {
    this.text = this.game.add.bitmapText(0, 0, Config.font, 'LOADING', 32*Config.scale);
    this.text.align = 'center';
    this.text.x = (this.game.width - this.text.textWidth) * 0.5;
    this.text.y = (this.game.height - this.text.textHeight) * 0.5 + 60*Config.scale;

    this.progressBar = new Spinner(this.game);
    this.game.add.existing(this.progressBar);
};

Loader.prototype.fileLoaded = function(progress) {
    this.progressBar.setProgress(progress);
};

Loader.prototype.fileError = function(error) {
    console.warn('file error : ' + error);
};

Loader.prototype.removeLoaderView = function() {
    if(this.text) {
        this.text.destroy();
    }
    if(this.progressBar) {
        this.progressBar.destroy();
    }
    this.text = null;
    this.progressBar = null;
};

Loader.prototype.queueAssets = function(game, assets) {
    var typeKey;
    for(typeKey in assets) {
        this.queueAssetsOfType(game, typeKey, assets[typeKey]);
    }
};

Loader.prototype.queueAssetsOfType = function(game, type, assets) {
    if(type in this.queueActions) {
        this.queue(game, assets, this.queueActions[type]);
        return;
    }
    throw 'Asset of unknown type: '+type;
};

Loader.prototype.queue = function(game, assets, queueTypeAction) {
    var i = 0,
        len = assets.length;

    for(;i<len;++i) {
        queueTypeAction(game, assets[i]);
    }
};

Loader.prototype.queueImage = function(game, asset) {
    game.load.image(asset.key, asset.url);
};

Loader.prototype.queueSound = function(game, asset) {
    game.load.audio(asset.key, asset.urls, asset.autoDecode);
};

Loader.prototype.queueAtlas = function(game, asset) {
    game.load.atlas(asset.key, asset.textureURL, asset.atlasURL, asset.atlasData, asset.format);
};

Loader.prototype.queueTilemap = function(game, asset) {
    game.load.tilemap(asset.key, asset.mapDataURL, asset.mapData, asset.format);
};

Loader.prototype.queueSpritesheet = function(game, asset) {
    game.load.spritesheet(asset.key, asset.url, asset.frameWidth, asset.frameHeight, asset.frameMax, asset.margin, asset.spacing);
};

Loader.prototype.queueFont = function(game, asset) {
    game.load.bitmapFont(asset.key, asset.textureURL, asset.xmlURL);
};

Loader.prototype.queueData = function(game, asset) {
    game.load.json(asset.key, asset.url);
};

Loader.prototype.destroy = function() {
    this.game.load.onFileComplete.removeAll();
    this.game.load.onFileError.removeAll();
    this.removeLoaderView();
};

module.exports = Loader;
