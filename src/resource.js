var res = {
    MainScene: "res/MainScene.json",
    GameOverLayer: "res/GameOverLayer.json",
    bombplist: "res/bomb.plist",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
