'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js'),
    Sound = require('../managers/sound.js');

function Intro(game, hero, callback, context) {
    Phaser.Group.call(this, game);
    this.hero = hero;
    this.callback = callback;
    this.context = context;
    this.start();
}

Intro.prototype = Object.create(Phaser.Group.prototype);
Intro.prototype.constructor = Intro;

Intro.prototype.start = function() {
    //to(properties, duration, ease, autoStart, delay, repeat, yoyo)

    var textA = new Phaser.BitmapText(this.game, 0, 130, Config.font, 'SCREENING FOR LIFEFORMS', 32);
    this.add(textA);
    textA.align = 'center';
    textA.x = (this.game.width - textA.textWidth) * 0.5;
    textA.alpha = 0;
    this.game.add.tween(textA).to({ alpha: 1 }, 800, Phaser.Easing.Linear.None, true, 200);

    setTimeout(this.target.bind(this), 500);

    Sound.sfx('scan', 500);
};

Intro.prototype.target = function() {
    var target = new Phaser.Image(this.game, -100, -100, 'textures', 'target');
    this.add(target);
    target.anchor.set(0.5, 0.5);
    this.game.add.tween(target).to({ x: this.hero.x, y: this.hero.y }, 2000, Phaser.Easing.Linear.None, true);

    var textB = new Phaser.BitmapText(this.game, 0, 226, Config.font, 'LIFEFORM DETECTED', 32);
    this.add(textB);
    textB.align = 'center';
    textB.x = (this.game.width - textB.textWidth) * 0.5;
    textB.alpha = 0;
    this.game.add.tween(textB).to({ alpha: 1 }, 800, Phaser.Easing.Linear.None, true, 2500);

    var textC = new Phaser.BitmapText(this.game, 0, 274, Config.font, 'DESTROY DESTROY DESTROY', 32);
    this.add(textC);
    textC.align = 'center';
    textC.x = (this.game.width - textC.textWidth) * 0.5;
    textC.alpha = 0;
    this.game.add.tween(textC).to({ alpha: 1 }, 800, Phaser.Easing.Linear.None, true, 3500);

    Sound.sfx('alert', 2000);

    setTimeout(this.callback.bind(this.context), 5000);
};

module.exports = Intro;
