'use strict';

var Phaser = require('Phaser');

function Obstacle(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.animations.add('anim', Phaser.Animation.generateFrameNames('zapper_', 1, 2, '', 0), 4, true);
    this.animations.play('anim');

    this.isOn = true;
}

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {

};

module.exports = Obstacle;
