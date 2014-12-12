'use strict';

var Phaser = require('Phaser');

function Enemy(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.name = 'enemy';
    this.anchor.set(0.5, 0.5);

    this.enemySpeed = 50;
    this.direction = Math.random() < 0.5 ? -1 : 1;

    game.physics.p2.enable(this);
    this.checkWorldBounds = true;
    this.body.collideWorldBounds = true;
    this.body.fixedRotation = true;

    this.animations.add('anim', Phaser.Animation.generateFrameNames('robot_', 1, 2, '', 0), 2, true);
    this.animations.play('anim');
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.attack = function() {
    this.body.velocity.x = this.enemySpeed * this.direction;
};

Enemy.prototype.update = function() {
    if(!this.alive) { return; }
    this.body.velocity.x = this.enemySpeed * this.direction;
};

Enemy.prototype.turn = function(direction) {
    direction = direction > 0 ? 1 : -1;
    if(direction === this.direction) {
        this.direction *= -1;
    }
};

module.exports = Enemy;
