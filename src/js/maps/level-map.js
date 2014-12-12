'use strict';

var Phaser = require('Phaser'),
    BaseMap = require('./base-map.js'),
    Collectable = require('../objects/collectable.js'),
    Spawner = require('../objects/spawner.js'),
    Turner = require('../objects/turner.js'),
    Obstacle = require('../objects/obstacle.js');

function LevelMap(game) {
    BaseMap.call(this, game);
}

LevelMap.prototype = Object.create(BaseMap.prototype);
LevelMap.prototype.constructor = LevelMap;

LevelMap.prototype.create = function(group) {
    this.group = group;
    this.tileMap = this.createtileMap();
    this.tileMap.addTilesetImage('tiles', 'tiles');
    this.createGround();
    this.createHazards();
    this.createEnemyAI();
    // this.createCollectables();
    // this.objectLayer('collectable', 4, 'tiles', 0, Phaser.Physics.P2JS);//, Collectable);
    this.setCollisions();
};

LevelMap.prototype.createtileMap = function() {
    return this.createTileMapWithName(this.game, 'map');
};

LevelMap.prototype.tileLayer = function(name, resizeWorld) {
    var layer = this.tileMap.createLayer(name, undefined, undefined, this.group);
    if(resizeWorld) {
        layer.resizeWorld();
    }
    layer.name = name;
    this.layers[name] = layer;
    return layer;
};

LevelMap.prototype.objectLayer = function(name, gid, key, frame, physics, constructor) {
    var layer = this.game.add.group(this.group, name, false, true, physics);
    //name, gid, key, frame, exists, autoCull, group, CustomClass
    this.tileMap.createFromObjects(name, gid, key, frame, true, false, layer, constructor);
    if(!layer.children.length) {
        console.warn('Object layer ' + name + ' has no objects');
    }
    layer.name = name;
    this.layers[name] = layer;
    return layer;
};

LevelMap.prototype.createGround = function() {
    this.tileLayer('ground', true);
};

LevelMap.prototype.createCollectables = function() {
//    this.objectLayer('collectables', 'textures', 'star', Phaser.Physics.ARCADE, Collectable);

    var collectables = this.game.add.group(this.group, 'collectables', false, true, Phaser.Physics.P2JS);
    this.tileMap.createFromObjects('collectable', 13, 'textures', 'star', true, false, collectables, Collectable);
    this.addLayer('collectables', collectables);
};

LevelMap.prototype.createHazards = function() {
    var obstacle = this.game.add.group(this.group, 'obstacle', false, true);
    this.tileMap.createFromObjects('obstacle', 4, 'textures', 'zapper_1', true, false, obstacle, Obstacle);
    this.addLayer('obstacle', obstacle);
};

LevelMap.prototype.createEnemyAI = function() {
    // createFromObjects(name, gid, key, frame, exists, autoCull, group, CustomClass, adjustY).
    var spawners = this.game.add.group(this.group, 'enemyspawn', false, true);
    this.tileMap.createFromObjects('enemyspawn', 4, 'textures', 'zapper_1', true, false, spawners, Spawner);
    this.addLayer('enemyspawn', spawners);

    // var turners = this.game.add.group(this.group, 'enemyturn', false, true, Phaser.Physics.P2JS);
    var turners = this.game.add.group(this.group, 'enemyturn', false, true);
    this.tileMap.createFromObjects('enemyturn', 4, 'textures', 'marker', true, false, turners, Turner);
    this.addLayer('enemyturn', turners);
};

LevelMap.prototype.setCollisions = function() {
    this.tileMap.setCollisionBetween(1, 4, true, 'ground');
    //this.tileMap.setCollision(11, true, 'platforms');
};

module.exports = LevelMap;
