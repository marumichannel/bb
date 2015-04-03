var windowHelper = function (game) {
    this.game = game;
    return this;
};

windowHelper.prototype.addAutoScaledBackground = function (spriteReference) {
    var game = this.game;
    var bg = game.add.sprite(game.world.centerX, game.world.centerY, spriteReference);
    bg.anchor.setTo(0.5, 0.5);
    var screenAspectRatio = this.getScreenRatio();
    var bgAspectRatio = bg.width / bg.height;
    // if background is wider than screen
    if (bgAspectRatio > screenAspectRatio) {
        bg.height = screen.height;
        bg.width = screen.height * bgAspectRatio;
    // if background is taller than screen
    } else {
        bg.width = screen.width;
        bg.height = screen.width / bgAspectRatio;
    } 
    return bg; 
};

windowHelper.prototype.getScreenRatio = function() {
    return window.innerWidth / window.innerHeight;
    // cheat sheet
    // 1.7777 = 16:9
    // 1.6000 = 8:5 = 16:10 
    // 1.3333 = 4:3
    // 1.2500 = 5:4
    // 0.8000 = 4:5
    // 0.7500 = 3:4
    // 0.6250 = 5:8 = 10:16
    // 0.5625 = 9:16
};