'use strict';

var Config = require('../config/config.js');

function BaseMap(game) {
    this.game = game;
}

BaseMap.prototype.init = function() {
    this.layers = {};
};

BaseMap.prototype.create = function() {};

BaseMap.prototype.createTileMapWithName = function(game, name) {
    if(Config.scale !== 1) {
        this.getAndScaleData(game, name);
    }
    var tilemap = game.add.tilemap(name);
    this.addLayer('tilemap', tilemap);
    return tilemap;
};

BaseMap.prototype.getAndScaleData = function(game, name) {
    var tilemapData = game.cache.getTilemapData(name);
    if(tilemapData.isScaled) { return; }
    this.scaleTileWidthAndHeight(tilemapData);
    this.scaleTilesets(tilemapData);
    this.scaleObjectLayers(tilemapData);
    tilemapData.isScaled = true;
};

BaseMap.prototype.scaleTileWidthAndHeight = function(tilemapData) {
    tilemapData.data.tilewidth *= Config.scale;
    tilemapData.data.tileheight *= Config.scale;
};

BaseMap.prototype.scaleTilesets = function(tilemapData) {
    var tilesets = tilemapData.data.tilesets;
    var i = 0,
        len = tilesets.length,
        tileset;
    for(;i<len;++i) {
        tileset = tilesets[i];
        tileset.imageheight *= Config.scale;
        tileset.imagewidth *= Config.scale;
        tileset.tileheight *= Config.scale;
        tileset.tilewidth *= Config.scale;
    }
};

BaseMap.prototype.scaleObjectLayers = function(tilemapData) {
    var layers = tilemapData.data.layers;
    var i = 0,
        len = layers.length,
        layer;
    for(;i<len;++i) {
        layer = layers[i];
        if(Object.prototype.toString.call(layer.objects) === '[object Array]') {
            layer.objects = this.scaleObjects(layer.objects);
        }
    }
};

BaseMap.prototype.scaleObjects = function(objects) {
    var i = 0,
        len = objects.length,
        object;
    for(;i<len;++i) {
        object = objects[i];
        object.x *= Config.scale;
        object.y *= Config.scale;
    }
    return objects;
};

BaseMap.prototype.destroy = function() {
    var key,
        layer;

    for(key in this.layers) {
        layer = this.layers[key];
        if(layer) {
            layer.destroy(true, true);
            this.removeLayer(key);
        }
    }
    this.layers = null;
};

BaseMap.prototype.addLayersToGroup = function(group, layerList) {
    var i = 0,
        len = layerList.length,
        key,
        layer;

    for(;i<len;++i) {
        key = layerList[i];
        layer = this.get(key);
        if(layer) {
            group.add(layer);
        }
    }
};

BaseMap.prototype.removeLayersFromStage = function(stage, layerList) {
    var l = layerList.length,
        key,
        layer;
    for(var i = 0; i < l; i++) {
        key = layerList[i];
        layer = this.get(key);
        if(layer) {
            stage.remove(layer);
        }
    }
};

BaseMap.prototype.addLayer = function(key, layer) {
    if(!layer) {
        return;
    }
    layer.name = key;
    this.layers[key] = layer;
};

BaseMap.prototype.removeLayer = function(key) {
    this.layers[key] = null;
    delete this.layers[key];
};

BaseMap.prototype.get = function(key) {
    return this.layers[key];
};

module.exports =  BaseMap;
