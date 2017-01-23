
var gojira;
var bo_jump = false;
var panel;
var panela;
var game_stop = false;
var bo_fire = false;
var fire;

var GameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        bo_jump = false;
        game_stop = false;
        bo_fire = false;

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

            var bg;
            if ( Math.floor(Math.random()*2) == 1 ) {
                bg = cc.Sprite.create("res/tower.png");
                bg.setAnchorPoint(cc.p(0.5,0.5));
                bg.setPosition(cc.p(-180, 270));
                bg.setScale(0.8,0.8);
                bg.setTag(1);
            } else {
                bg = cc.Sprite.create("res/biru.png");
                bg.setAnchorPoint(cc.p(0.5,0.5));
                bg.setPosition(cc.p(-180, 300));
                bg.setScale(1.5,1.5);
                bg.setTag(2);
            }
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


                    cc.audioEngine.playEffect("res/jump.mp3");

                    gojira.runAction(cc.Sequence.create(cc.JumpBy.create(0.5, cc.p(0,0), 150, 1), cc.CallFunc.create(function(){

                        bo_jump = false;

                    }, this)));
                }

                    
            }
        }, this);

        var btn_fire = scene.node.getChildByName("btn_fire");
        btn_fire.addTouchEventListener(function(button,type){
            if(type==ccui.Widget.TOUCH_BEGAN){

                console.log("button");

                if(!bo_fire){

                    bo_fire = true;

                    fire = cc.Sprite.create("res/icon_error.png");
                    fire.setPosition(cc.p(gojira.getPosition().x-60, gojira.getPosition().y+70));
                    this.addChild(fire);

                    cc.audioEngine.playEffect("res/shoot.mp3");

                    fire.runAction(cc.Sequence.create(cc.MoveBy.create(0.5, cc.p(-600, 0)), cc.CallFunc.create(function(){

                        fire.removeFromParent();
                        bo_fire = false; 

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
        //console.log(gr);

        var fr;
        if ( bo_fire ) {
            fr = fire.getBoundingBox();
            fr.width -= 10;
            fr.height -= 10;

        }

        
        for ( var i = 0; i < panel.getChildren().length; i++){
            
            var t = panel.getChildren()[i];
            var tr = t.getBoundingBox();
            tr.width -= 10;
            tr.height -= 30;
            if ( cc.rectIntersectsRect(gr, tr) ) {

                console.log(gr);
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

            if ( bo_fire ) {
                if ( t.getTag() == 2 ) {
                    if ( cc.rectIntersectsRect(fr, tr) ) {
                        var rp = t.getPosition();
                        t.stopAllActions();
                        t.removeFromParent();
                        fire.stopAllActions();
                        fire.removeFromParent();
                        bo_fire = false;
                        cc.audioEngine.playEffect("res/fire.mp3");
                        var p = cc.ParticleSystem.create("res/bomb.plist");
                        p.setPosition(rp);
                        p.setAutoRemoveOnFinish(true);
                        this.addChild(p);
                        p.resetSystem();
                    }
                }
            }



        }


        

    }
});

