'use strict';

var Phaser = require('Phaser');

function Turner(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.alpha = 0;
}

Turner.prototype = Object.create(Phaser.Sprite.prototype);
Turner.prototype.constructor = Turner;

Turner.prototype.update = function() {
};

module.exports = Turner;
