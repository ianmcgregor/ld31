'use strict';

var Phaser = require('Phaser');

Phaser.Plugin.ScreenShake = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);
    this.screenShakes = 0;
    this.shakedAt = 0;
};

Phaser.Plugin.ScreenShake.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.ScreenShake.prototype.constructor = Phaser.Plugin.ScreenShake;

Phaser.Plugin.ScreenShake.prototype.start = function (count) {
    if(this.game.time.now - this.shakedAt < 200) {
        return;
    }
    count = count || 20;
    this.screenShakes = count;

    if (window.navigator && window.navigator.vibrate) {
        navigator.vibrate(count*10);
    }
    this.shakedAt = this.game.time.now;
};

Phaser.Plugin.ScreenShake.prototype.postUpdate = function () {
    if (this.screenShakes > 0) {
        this.screenShakes--;
        var amt = this.screenShakes * 0.5;
        if (this.screenShakes % 2) {
            this.game.camera.displayObject.position.y += amt;
        }
        else {
            this.game.camera.displayObject.position.y -= amt;
        }
    }
};

module.exports = Phaser.Plugin.ScreenShake;
