
Bb.MainMenu = function (game) {

    this.se = null;
    this.playButton = null;

};

Bb.MainMenu.prototype = {

    create: function () {
        var game = this.game;
        game.windowHelper = new windowHelper(game);
        this.se = this.add.audio('startsound');
        game.windowHelper.addAutoScaledBackground('titlebg');
        var logo = this.add.sprite(game.world.centerX, game.world.centerY, 'gamelogo');
        logo.anchor.set(0.5, 0.5);
        logo.scale.set(0.75, 0.75);

        var pressb = game.add.text(game.world.centerX, game.height - 40, "PRESS B", {font: 'bold 30px Arial', fill: '#f2ab41', strokeThickness: 2, stroke: '#fff'});
        pressb.anchor.set(0.5, 0.5);
        pressb.alpha = 0.2;
        game.add.tween(pressb).to({alpha: 1}, 1000, Phaser.Easing.InOut, true, 0, -1, true);

        var key = game.input.keyboard.addKey(Phaser.Keyboard.B);
        key.onDown.add(this.startGame, this);
        game.input.onDown.add(this.startGame, this);
    },

    update: function () {

    },

    startGame: function (pointer) {
        this.se.play();
        this.state.start('Game');
    },
};