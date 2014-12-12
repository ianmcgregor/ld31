'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js'),
    Controls = require('../managers/controls.js'),
    p2 = require('p2'),
    Sound = require('../managers/sound.js');

function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'textures', 'hero_4');
    this.scaleAmount = Config.gfxScale;
    this.scale.set(this.scaleAmount);
    this.name = 'hero';
    this.anchor.set(0.5, 0.5);

    this.runSpeed = 200;
    this.jumpSpeed = 200;
    this.jumpedAt = 0;

    Sound.get('shoot').volume = 0.1;
    this.animations.add('run', Phaser.Animation.generateFrameNames('hero_', 1, 2, '', 0), 4, true);

    game.physics.p2.enable(this);
    this.body.fixedRotation = true;
    this.body.setMaterial(this.game.physics.p2.createMaterial('character'));
    this.body.mass = 10;
    this.body.damping = 0.5;
    this.body.allowSleep = false;
    this.body.collideWorldBounds = true;
    // this.body.setRectangle(12, 40, 0, 4);
    // this.game.camera.follow(this);

    this.firedAt = 0;
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.P2JS;
    this.bullets.createMultiple(100, 'textures', 'bullet', false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('body.collideWorldBounds', false);
    this.bullets.setAll('body.data.gravityScale', 0); // ignore gravity
    this.bullets.setAll('body.mass', 0.05);
    this.bullets.setAll('name', 'bullet');
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.update = function() {
    if(!this.alive) { return; }

    var grounded = this.isGrounded();

    if(grounded) {
        this.body.velocity.x *= 0.2;
        this.body.velocity.y = 0;
        this.jumpedAt = 0;
    }
    if(Controls.left) {
        this.body.moveLeft(this.runSpeed);
        this.scale.x = -this.scaleAmount;
        this.animations.play('run');
    }
    else if(Controls.right) {
        this.body.moveRight(this.runSpeed);
        this.scale.x = this.scaleAmount;
        this.animations.play('run');
    }
    else
    {
        this.animations.stop();
        this.frameName = 'hero_4';
    }

    if(!Controls.up) {
        this.jumpedAt = 0;
    }
    if (Controls.up && (grounded || (this.jumpedAt > 0 && this.game.time.now - this.jumpedAt < 200))) {
        if(this.jumpedAt === 0) {
            this.jumpedAt = this.game.time.now;
        }
        var mul = 0.5;
        var force = this.jumpSpeed + (this.game.time.now - this.jumpedAt) * mul;
        this.body.moveUp(force);
    }

    if(Controls.space) {
        this.fire();
    }
};

Hero.prototype.isGrounded = function() {
    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;
    var contact = this.game.physics.p2.world.narrowphase.contactEquations;

    for (var i = 0; i < contact.length; i++) {
        var c = contact[i];

        if (c.bodyA === this.body.data || c.bodyB === this.body.data) {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === this.body.data) { d *= -1; }
            if (d > 0.5) { result = true; }
        }
    }
    return result;
};

Hero.prototype.fire = function() {
    if (this.game.time.now > this.firedAt + 20 && this.bullets.countDead() > 0) {
        var bullet = this.bullets.getFirstDead();
        bullet.reset(this.x, this.y + 2);
        bullet.body.velocity.x = 400 * this.scale.x;
        bullet.body.velocity.y = -60 + Math.random() * 60;

        if(Math.abs(this.body.velocity.x) < this.runSpeed / 2) {
            if(this.isGrounded) {
                this.body.velocity.x += this.scale.x * -80;
            }
            else {
                this.body.velocity.x += this.scale.x * -40;
            }
            if(this.game.time.now - this.firedAt > 200) {
                this.body.velocity.y = -100;
            }
        }

        Sound.sfx('shoot');

        this.firedAt = this.game.time.now;
    }
};

module.exports = Hero;
