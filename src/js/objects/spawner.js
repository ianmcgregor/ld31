'use strict';

var Phaser = require('Phaser');

function Spawner(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.alpha = 0;

    this.enemyCreatedAt = 0;
    this.enemy = null;
}

Spawner.prototype = Object.create(Phaser.Sprite.prototype);
Spawner.prototype.constructor = Spawner;

Spawner.prototype.update = function() {
    if(!this.enemies) { return; }
    if(this.enemy && this.enemy.alive) { return; }
    if(this.enemy) { return; }
    if(this.game.time.now > this.enemyCreatedAt + 1000 && this.enemies.countDead() > 0) {
        this.enemyCreatedAt = this.game.time.now;
        this.enemy = this.enemies.getFirstDead();
        var enemyY = this.y + 4;
        var enemyX = this.x + 16;
        this.enemy.reset(enemyX, enemyY);
        this.enemy.attack();
    }
};

module.exports = Spawner;
