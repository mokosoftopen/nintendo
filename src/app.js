
var gojira;
var bo_jump = false;
var panel;
var panela;
var game_stop = false;

var GameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        bo_jump = false;
        game_stop = false;

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var scene = ccs.loadWithVisibleSize(res.MainScene);
        this.addChild(scene.node);


        gojira = scene.node.getChildByName("gojira");
        panel = scene.node.getChildByName("Panel");
        panela = scene.node.getChildByName("Panela");

        var walk_animation = cc.Animation.create();
        walk_animation.addSpriteFrameWithFile("res/gojira1.png");
        walk_animation.addSpriteFrameWithFile("res/gojira2.png");

        walk_animation.setDelayPerUnit(0.1);

        var walk_animate = cc.Animate.create(walk_animation);
        var walk_repeat = cc.RepeatForever.create(walk_animate);
        gojira.runAction(walk_repeat);


        this.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.DelayTime.create(1), cc.CallFunc.create(function(){

            if(game_stop)return;

            var bg = cc.Sprite.create("res/bg1.png");
            bg.setPosition(cc.p(-180, 270));
            panela.addChild(bg);

            bg.runAction(cc.Sequence.create(cc.MoveBy.create(3, cc.p(1500,0)), cc.CallFunc.create(function(){
                bg.removeFromParent();
            }, this)));




        }
            , this))));


        this.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.DelayTime.create(2), cc.CallFunc.create(function(){

            if(game_stop)return;

            var bg = cc.Sprite.create("res/tower.png");
            bg.setPosition(cc.p(-180, 270));
            bg.setScale(0.8,0.8);
            panel.addChild(bg);

            bg.runAction(cc.Sequence.create(cc.MoveBy.create(3, cc.p(1500,0)), cc.CallFunc.create(function(){
                bg.removeFromParent();
            }, this)));




        }
            , this))));


        var btn = scene.node.getChildByName("btn");
        btn.addTouchEventListener(function(button,type){
            if(type==ccui.Widget.TOUCH_BEGAN){

                console.log("button");

                if(!bo_jump){

                    bo_jump = true;

                    gojira.runAction(cc.Sequence.create(cc.JumpBy.create(0.5, cc.p(0,0), 150, 1), cc.CallFunc.create(function(){

                        bo_jump = false;

                    }, this)));
                }

                    
            }
        }, this);







        
        return true;
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);

        this.scheduleUpdate();
    },
    update:function(){
        
        var gr = gojira.getBoundingBox();
        gr.width -= 120;
        gr.height -= 120;
        console.log(gr);

        
        for ( var i = 0; i < panel.getChildren().length; i++){
            
            var t = panel.getChildren()[i];
            var tr = t.getBoundingBox();
            tr.width -= 10;
            tr.height -= 50;
            if ( cc.rectIntersectsRect(gr, tr) ) {

                console.log(tr);
                this.unscheduleUpdate();
                game_stop = true;
                this.stopAllActions();
                gojira.stopAllActions();

                for ( var j = 0; j < panel.getChildren().length; j++){
                    var k = panel.getChildren()[j];
                    k.stopAllActions();
                }
                for ( var j = 0; j < panela.getChildren().length; j++){
                    var k = panela.getChildren()[j];
                    k.stopAllActions();
                }

                var gameover = ccs.loadWithVisibleSize(res.GameOverLayer);
                this.addChild(gameover.node);
                var btn_re = gameover.node.getChildByName("btn_re");
                btn_re.addTouchEventListener(function(button,type){
                    if(type==ccui.Widget.TOUCH_BEGAN){

                        var s = new GameScene();
                        var t = cc.TransitionFade.create(0.5, s);
                        cc.director.runScene(s);

                            
                    }
                }, this);



            }

        }


        

    }
});

