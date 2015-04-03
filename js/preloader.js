var Bb = {};

Bb.Preloader = function (game) {
    this.game = game;
    this.ready = false;
    this.fontsready = false;
};

Bb.Preloader.prototype = {

    preload: function () {
        this.input.maxPointers = 1;
        var game = this.game;
        game.stage.backgroundColor = '#000000';
        var connecting = game.add.text(game.width - 30, 30, "CONNECTING...", {font: 'bold 20px Arial', fill: '#ffffff'});
        connecting.anchor.set(1, 0.5);
        connecting.alpha = 0;
        game.add.tween(connecting).to({alpha: 1}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
        var note = game.add.text(game.width - connecting.width - 40, 28, "♪", {font: 'bold 25px Arial', fill: '#ffffff'});
        note.anchor.set(1, 0.5);
        game.add.tween(note).to({y: 32}, 750, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

        this.load.image('loveliver','assets/sprites/loveliver.png');
        this.load.image('scorebg','assets/bg/scorebg.png');
        this.load.image('background','assets/bg/ssa.jpg');
        this.load.image('titlebg','assets/bg/bb.jpg');
        this.load.image('soramaru','assets/sprites/soramaru.png');
        this.load.image('gamelogo','assets/sprites/bb.png');
        this.load.spritesheet('rings','assets/sprites/rings.png', 420, 420, 3);
        this.load.spritesheet('pop','assets/sprites/sparkler.png', 600, 600, 8);
        this.load.audio('shan_perfect',['assets/audio/shan_perfect.ogg','assets/audio/shan_perfect.mp3']);
        this.load.audio('shan_great',['assets/audio/shan_great.ogg','assets/audio/shan_great.mp3']);
        this.load.audio('shan_good',['assets/audio/shan_good.ogg','assets/audio/shan_good.mp3']);
        this.load.audio('shan_bad',['assets/audio/shan_bad.ogg','assets/audio/shan_bad.mp3']);
        this.load.audio('full_combo',['assets/audio/264981__renatalmar__sfx-magic.ogg','assets/audio/264981__renatalmar__sfx-magic.mp3']);
        this.load.audio('startsound',['assets/audio/243020__plasterbrain__game-start.ogg','assets/audio/243020__plasterbrain__game-start.mp3']);
        this.load.audio('end_beep',['assets/audio/146721__fins__menu-click.ogg','assets/audio/146721__fins__menu-click.mp3']);
        this.load.audio('serifu01',['assets/audio/serifu01.ogg','assets/audio/serifu01.mp3']);
        this.load.audio('mc01',['assets/audio/bb.ogg','assets/audio/bb.mp3']);

        var self = this;
        WebFontConfig = {
            active: function() {
                self.fontsready = true;
            },
        };
        WebFont.load({
            google: {
                families: ['Nunito','Rajdhani:600']
            }
        });

    },

    create: function () {


    },

    update: function () {

        if (this.cache.isSoundDecoded('mc01') && this.ready === true && this.fontsready === true);
        {
            this.ready = true;
            this.state.start('MainMenu');
        }

    }

};