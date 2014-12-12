'use strict';

var Phaser = require('Phaser');

function Dpad(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key || this.defaultImage(game), frame);
    this.init();
}

Dpad.FOUR_WAY = 0;
Dpad.EIGHT_WAY = 1;
Dpad.FREE_ANGLE = 2;

Dpad.prototype = Object.create(Phaser.Sprite.prototype);
Dpad.prototype.constructor = Dpad;

Dpad.prototype.init = function() {
    this.anchor.set(0.5, 0.5);
    this.minDistance = 20;
    this.maxDistance = 80;
    this.mode = Dpad.FOUR_WAY;
    this.x = this.x + this.width / 2;
    this.y = this.y + this.height / 2;
    this.temp = new Phaser.Sprite(this.game, 0, 0, 'textures', 'heart');
    this.temp.anchor.set(0.5, 0.5);
    this.addChild(this.temp);
};

Dpad.prototype.update = function() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.isDown = false;

    var pointer = this.game.input.activePointer;
    if(pointer.isDown) {
        // get relative pointer position
        var localX = pointer.x - this.x;// + this.game.camera.x;
        var localY = pointer.y - this.y;// + this.game.camera.y;

        // check if in bounds
        var distanceSQ = localX * localX + localY * localY;
        var inBounds = distanceSQ < this._maxDistanceSQ && distanceSQ > this._minDistanceSQ;
        if(!inBounds) {
            return;
        }

        this.temp.x = localX;
        this.temp.y = localY;

        var angle = Math.atan2(localY, localX);

        switch(this.mode) {
            case Dpad.FOUR_WAY:
                this.calculateFourWay(angle);
                break;
            case Dpad.EIGHT_WAY:
                this.calculateEightWay(angle);
                break;
            case Dpad.FREE_ANGLE:
                this.angle = angle;
                this.isDown = true;
                break;

        }
    }
};

Dpad.prototype.calculateFourWay = function(angle) {

    // shift round 45 deg for 4way
    angle += Math.PI / 4;

    // convert to positive
    if(angle <= 0) { angle += Math.PI * 2; }

    // convert to deg
    angle = angle * 180 / Math.PI;

    // 4 way
    //var step = Math.floor(angle / 90);
    ////console.log('step:', ['right', 'down', 'left', 'up'][step]);

    // 4 way
    if(angle >= 0 && angle < 90) {
        //console.log('right');
        this.right = true;
    }
    else if(angle >= 90 && angle < 180) {
        //console.log('down');
        this.down = true;
    }
    else if (angle >= 180 && angle < 270) {
        //console.log('left');
        this.left = true;
    }
    else if (angle >= 270 && angle <= 360) {
        //console.log('up');
        this.up = true;
    }
};

Dpad.prototype.calculateEightWay = function(angle) {

    // shift round 22.5 deg for 8way
    angle += Math.PI / 8;

    // convert to positive
    if(angle <= 0) { angle += Math.PI * 2; }

    // convert to deg
    angle = angle * 180 / Math.PI;

    // 8 way
    //var step = Math.floor(angle / 45);
    ////console.log('step:', ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'][step]);

    // 8 way
    if(angle >= 0 && angle < 45) {
        //console.log('right');
        this.right = true;
    }
    else if(angle >= 45 && angle < 90) {
        //console.log('down-right');
        this.down = true;
        this.right = true;
    }
    else if(angle >= 90 && angle < 135) {
        //console.log('down');
        this.down = true;
    }
    else if(angle >= 135 && angle < 180) {
        //console.log('down-left');
        this.down = true;
        this.left = true;
    }
    else if (angle >= 180 && angle < 225) {
        //console.log('left');
        this.left = true;
    }
    else if (angle >= 225 && angle < 270) {
        //console.log('up-left');
        this.up = true;
        this.left = true;
    }
    else if (angle >= 270 && angle < 315) {
        //console.log('up');
        this.up = true;
    }
    else if (angle >= 315 && angle <= 360) {
        //console.log('up-right');
        this.up = true;
        this.right = true;
    }
};

Dpad.prototype.defaultImage = function(game) {
    var dataURI = this.getDefaultImage();
    var data = new Image();
    data.src = dataURI;
    game.cache.addImage('dpad', dataURI, data);
    return 'dpad';
};

Dpad.prototype.getDefaultImage = function() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAYAAADj79J' +
    'YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5' +
    'hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmV' +
    'Tek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1' +
    'wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo' +
    '1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8' +
    'xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ' +
    '9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXB' +
    'NTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA' +
    '6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9' +
    'yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2V' +
    'JRD0ieG1wLmlpZDo3RkEyMzg3OTdDRUMxMUUyQjdDQkJEMzFENDkwODI4OSIgeG1wTU06RG9' +
    'jdW1lbnRJRD0ieG1wLmRpZDo3RkEyMzg3QTdDRUMxMUUyQjdDQkJEMzFENDkwODI4OSI+IDx' +
    '4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdGQTIzODc3N0N' +
    'FQzExRTJCN0NCQkQzMUQ0OTA4Mjg5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdGQTI' +
    'zODc4N0NFQzExRTJCN0NCQkQzMUQ0OTA4Mjg5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3J' +
    'kZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+els69AAAAxlJREFUeNr' +
    'snT1yxCAMhc0Oh0napEnuX6RKneM4myINs4vQLwI/VZnJrA3y88dDBruc53nMiM/31/8/Qxv' +
    'w9f1TjolxOxBIOBKOMIvixXAGo1lMvTP42XlG45zJ+Dr7ircJ9DqG4MIAKWB4grC4Q5ZguAW' +
    'jJcm6n/fUMpfAiyvj6xUV+KhNUYwHw8HwvWMYKR1mu/rWltkD/y89jP31g8Bc8RxD1Az3ZHS' +
    'kd6b6YdWW1EjxuJizB3EwPIsPZzCbxVAtsyV9NG5Pt/8U06v2lsxSo4hGnbTfQAoYDh9OMrJ' +
    'lWnO7cRlK+VrXecAAs6HwSyncehCVTEC8vbXl8aHwWQo3rJVYM901DJhdesdrfXmNvJ128+I' +
    'SlNYsDcmcTLiUi/vwUKa3TOTeQd4+Gwq/msJXYHqkMYDCoxU+gWldpj9gNFkf740Js/vXnr/' +
    'Cd8eis2Zt2C7MBsNXdyncdSEDvlrL3JNguolvl94lUPiGM81Q5lIKtuL3wAqudRO+00SpCq6' +
    's6bqRHrOFHWP5fEFQ84Zuu287qggMD0x29toNXEo2hQuYffZUNXuvu/WYRPn0NhdQOJCyt2V' +
    'EwoOjfLy9cGsXpnvnD+P15RyfL2zfockXFD7bpVhsLrKsfcz2+NL+PvsdFL7ATJPa46M+nmb' +
    'dSsAzTNXxoPDsCvdeD+7BdOtC2LNZJBS+CcNNmTayD5KppOg9R1D41gr34qOG6Zqn9Jz+Sfo' +
    'OhQfHXy2lO/e3rl+P+GTuTJV6PwoxbzCp3Yzukaoai4PgI6lmbFS2MQEu5eI+PLS2Yb2v8gj' +
    'eRwqF76bwaGZnZzoUnkDhrL3j3syOmItImC59N0HNap928d1TGJ55YWa00MDw1VxKgM+mgqq' +
    'Xa+vfpj4dCt/Bh6+8mN6b6VB4QoVb76NkM1T5e3efbpJw+HIffG7/TNOqPZd4YTtcyhjTW4U' +
    'UpcJCxhCvb8eJEw6m2+CqIgmxAYYvONPk1sdZjH+ALtH7T6IY7ZbwqO/e7IanevUETGE4ZpF' +
    'rMdyV8Uw+q9uzbMKzMh6fBrtY3B4t9wXT/eJXgAEAnIi8IO75XWQAAAAASUVORK5CYII=';
};

Object.defineProperty(Dpad.prototype, 'minDistance', {
    set: function(value) {
        this._minDistanceSQ = value * value;
    }
});

Object.defineProperty(Dpad.prototype, 'maxDistance', {
    set: function(value) {
        this._maxDistanceSQ = value * value;
    }
});

module.exports = Dpad;
