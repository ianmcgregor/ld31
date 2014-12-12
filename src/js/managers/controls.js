'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js');

function Controls() {}

Controls.prototype.init = function(game) {
    this.userControlRemoved = false;

    this.game = game;
    this.tapRate = this.game.input.tapRate = Config.controls.tapRate;
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.SPACEBAR,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.W,
        Phaser.Keyboard.A,
        Phaser.Keyboard.S,
        Phaser.Keyboard.D
    ]);

    this.key = {
        space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
        left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
        down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
        right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
        w: game.input.keyboard.addKey(Phaser.Keyboard.W),
        a: game.input.keyboard.addKey(Phaser.Keyboard.A),
        s: game.input.keyboard.addKey(Phaser.Keyboard.S),
        d: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    this.swipedUp = false;
    this.swipedDown = false;
};

Object.defineProperties(Controls.prototype, {
    space: {
        get: function() {
            if(this.userControlRemoved) { return false; }
            return this.key.space.isDown;
        }
    },
    up: {
        get: function() {
            if(this.userControlRemoved) { return false; }
            return (this.key.up.isDown ||
                   this.key.w.isDown ||
                   (this.dpad && this.dpad.up) ||
                   (this.btnA && this.btnA.pressed));
        }
    },
    left: {
        get: function() {
            if(this.userControlRemoved) { return false; }
            return (this.key.left.isDown ||
                   this.key.a.isDown ||
                   (this.dpad && this.dpad.left));
        }
    },
    down: {
        get: function() {
            if(this.userControlRemoved) { return false; }
            return (this.key.down.isDown ||
                   this.key.s.isDown ||
                   (this.dpad && this.dpad.down));
        }
    },
    right: {
        get: function() {
            if(this.userControlRemoved) { return false; }
            return (this.key.right.isDown ||
                   this.key.d.isDown ||
                   (this.dpad && this.dpad.right));
        }
    },
    pointer: {
        get: function() {
            return this.game.input.activePointer.isDown;
        }
    }
});

Controls.prototype.isSwipedDown = function() {
    var pointer = this.game.input.activePointer;
    if(!pointer.isDown) {
        this.swipedDown = false;
    }
    else if(!this.swipedDown) {
        this.swipedDown = (
            pointer.isDown &&
            pointer.duration > this.tapRate &&
            this.game.input.speed.y > 10 );
    }

    if(this.swipedDown) {
        this.swipedUp = false;
    }

    return this.swipedDown;
};

Controls.prototype.isSwipedUp = function() {
    var pointer = this.game.input.activePointer;
    if(!pointer.isDown) {
        this.swipedUp = false;
    }
    else if(!this.swipedUp) {
        this.swipedUp = (
            pointer.isDown &&
            pointer.duration > this.tapRate &&
            this.game.input.speed.y < -10 );
    }

    if(this.swipedUp) {
        this.swipedDown = false;
    }

    return this.swipedUp;
};

Controls.prototype.isSwipedLeft = function() {
    var pointer = this.game.input.activePointer;
    return (
        pointer.isDown &&
        pointer.duration > this.tapRate &&
        this.game.input.speed.x < -Config.controls.swipeThreshold );
};

Controls.prototype.isSwipedRight = function() {
    var pointer = this.game.input.activePointer;
    return (
        pointer.isDown &&
        pointer.duration > this.tapRate &&
        this.game.input.speed.x > Config.controls.swipeThreshold );
};

module.exports = new Controls();
