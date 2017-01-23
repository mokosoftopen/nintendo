var res = {
    MainScene: "res/MainScene.json",
    GameOverLayer: "res/GameOverLayer.json",
    bombplist: "res/bomb.plist",
    fire_mp3: "res/fire.mp3",
    jump_mp3: "res/jump.mp3",
    shoot_mp3: "res/shoot.mp3",
    bgm_mp3: "res/ningojira.mp3",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
