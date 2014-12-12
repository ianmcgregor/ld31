'use strict';

var Phaser = require('Phaser'),
    Config = require('../../config/config.js'),
    Sound = require('../../managers/sound.js');

function TextButton(game, text, key, up, down, callback, callbackContext) {
    Phaser.Button.call(this, game, 0, 0, key, callback, callbackContext, up, up, down, up);
    this.scale.set(Config.gfxScale);

    this.label = new Phaser.BitmapText(game, 0, 0, Config.font, '', 32);
    this.label.scale.set(1 / Config.gfxScale);
    this.label.align = 'center';
    this.addChild(this.label);
    game.add.existing(this);
    
    this.onInputOver.add(this.onOver, this);
    this.onInputOut.add(this.onOut, this);
    this.onInputDown.add(this.onDown, this);
    this.onInputUp.add(this.onUp, this);

    this.text = text;
    this.labelY = 8;
    this.labelYPressed = 22;
    this.centerText();
    this.pressed = false;
}

TextButton.prototype = Object.create(Phaser.Button.prototype);
TextButton.prototype.constructor = TextButton;

TextButton.prototype.centerText = function() {
    this.label.updateTransform();
    this.label.x = (this.width - this.label.textWidth) * 0.5;
    this.onOut();
};

TextButton.prototype.onOver = function() {
    this.label.y = this.labelY;
};

TextButton.prototype.onOut = function() {
    this.label.y = this.labelY;
};

TextButton.prototype.onDown = function() {
    this.label.y = this.labelYPressed;
    Sound.sfx('select');
    this.pressed = true;
};

TextButton.prototype.onUp = function() {
    this.label.y = this.labelY;
    this.pressed = false;
};


Object.defineProperty(TextButton.prototype, 'text', {
    get: function() {
        return this.label.text;
    },
    set: function(value) {
        this.label.text = value.toUpperCase();
        this.centerText();
    }
});

module.exports = TextButton;
