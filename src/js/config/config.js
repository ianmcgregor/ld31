'use strict';

var Phaser = require('Phaser'),
    UrlParams = require('../utils/url-params.js');

var device = Phaser.Device,
    debug = UrlParams.debug === 'true',
    bust = debug ? '?bust=' + Date.now() : '',
    assetSize = 'hd',//UrlParams.size || PhaserUtils.getAssetSize();
    gameScales = {
        hd: 1,
        sd: 1
    },
    scale = gameScales[assetSize],
    baseUrls = {
        img: 'img/',
        data: 'data/',
        font: 'font/',
        audio: 'audio/'
    };

var Config = {
    title: 'EGoOS',
    width: 640 * scale,
    height: 320 * scale,
    backgroundColor: 0x2b2633,
    font: 'Silkscreen',
    gfxScale: (assetSize === 'hd' ? 1 : 2),
    urlParams: UrlParams,
    debug: debug,
    scale: scale,
     // If we are debugging use canvas, if we are in IE use canvas, otherwise let Phaser decide
    renderer: (debug||device.ie||device.android) ? Phaser.CANVAS : Phaser.AUTO,
    id: 'game-wrapper',
    assetSize: assetSize,
    device: device,
    hero: {
        lives: 1
    },
    levels: [
        {
            name: 'level1'
        }
    ],
    controls: {
        tapRate: 50,
        swipeThreshold: 10
    },
    assets: {
       boot: {
            images: [

            ],
            atlases: [
                {
                    key: 'loader',
                    textureURL: baseUrls.img+assetSize+'/loader.png',
                    atlasURL: baseUrls.img+assetSize+'/loader.json',
                    format: Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY
                }
            ],
            fonts: [
                {
                    key: 'Silkscreen',
                    textureURL: baseUrls.font+'/silkscreen.png',
                    xmlURL: baseUrls.font+'/silkscreen.xml'
                }
            ]
        },
        preloader: {
            images: [
                {
                    key: 'tiles',
                    url: baseUrls.img+assetSize+'/tiles.png'
                }
            ],
            data: [

            ],
            atlases: [
                {
                    key: 'textures',
                    textureURL: baseUrls.img+assetSize+'/textures.png',
                    atlasURL: baseUrls.img+assetSize+'/textures.json',
                    format: Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY
                }
            ],
            sounds: [
                {
                    key: 'shoot',
                    urls: [ baseUrls.audio+'shoot.ogg', baseUrls.audio+'shoot.mp3'],
                    autoDecode: true
                },
                {
                    key: 'explode',
                    urls: [ baseUrls.audio+'explode.ogg', baseUrls.audio+'explode.mp3'],
                    autoDecode: true
                },
                {
                    key: 'scan',
                    urls: [ baseUrls.audio+'scan.ogg', baseUrls.audio+'scan.mp3'],
                    autoDecode: true
                },
                {
                    key: 'hit',
                    urls: [ baseUrls.audio+'hit.ogg', baseUrls.audio+'hit.mp3'],
                    autoDecode: true
                },
                {
                    key: 'alert',
                    urls: [ baseUrls.audio+'alert.ogg', baseUrls.audio+'alert.mp3'],
                    autoDecode: true
                }
            ]
        },
        levels: [
            {
                images: [

                ],
                atlases: [
                ],
                tilemaps: [
                    {
                        key: 'map',
                        mapDataURL: baseUrls.data+'level01.json'+bust,
                        format: Phaser.Tilemap.TILED_JSON
                    }
                ]
            }
        ]
    }
};

module.exports = Config;
