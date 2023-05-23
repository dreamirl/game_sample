/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game declaration
**/
import DE from '@dreamirl/dreamengine';
var Game = {};

Game.render = null;
Game.scene = null;
Game.ship = null;
Game.obj = null;

// init
Game.init = function() {
  console.log('game init');
  // DE.config.DEBUG = 1;
  // DE.config.DEBUG_LEVEL = 2;

  // Create the renderer before assets start loading
  Game.render = new DE.Render('render', {
    resizeMode: 'stretch-ratio',
    width: 1920,
    height: 1080,
    backgroundColor: '0x00004F',
    roundPixels: false,
    powerPreferences: 'high-performance',
  });
  Game.render.init();

  DE.start();
};

Game.onload = function() {
  console.log('game start');

  // scene
  Game.scene = new DE.Scene();

  // don't do this because DisplayObject bounds is not set to the render size but to the objects inside the scene
  // scene.interactive = true;
  // scene.click = function()
  // {
  //   console.log( "clicked", arguments );
  // }

  // if no Camera, we add the Scene to the render (this can change if I make Camera)

  Game.camera = new DE.Camera(0, 0, 1920, 1080, {
    scene: Game.scene,
    backgroundImage: 'bg',
  });
  Game.camera.interactive = true;
  Game.camera.pointermove = function(pos, e) {
    Game.targetPointer.moveTo(pos, 100);
  };
  Game.camera.pointerdown = function(pos, e) {
    Game.ship.gameObjects[0].moveTo(Game.targetPointer, 500);
    // Game.targetPointer.shake( 10, 10, 200 );
    Game.targetPointer.renderer.setBrightness([1, 0]);
  };
  Game.camera.pointerup = function(pos, e) {
    console.log('up');
    Game.targetPointer.shake(10, 10, 200);
  };
  Game.render.add(Game.camera);
  // Game.render.add( Game.scene );

  Game.targetPointer = new DE.GameObject({
    zindex: 500,
    renderer: new DE.SpriteRenderer({ spriteName: 'target', scale: 0.3 }),
  });
  Game.targetPointer.name = 'La target';

  Game.ship;
  Game.ship2;

  // WIP working on a simple "AnimatedSprite" declaration
  // var imgs = ["ship1.png","ship2.png","ship3.png","ship4.png","ship5.png","ship6.png"];
  // var textureArray = [];

  // for (var i=0; i < imgs.length; i++)
  // {
  //   var texture = PIXI.utils.TextureCache[imgs[i]];
  //   textureArray.push(texture);
  // };

  // var mc = new PIXI.extras.AnimatedSprite(textureArray);

  Game.ship = new DE.GameObject({
    x: 240,
    y: 240,
    scale: 1,
    renderers: [
      new DE.SpriteRenderer({ spriteName: 'ayeraShip' }),
      new DE.TextRenderer('', {
        localizationKey: 'player.data.realname',
        y: -100,
        textStyle: {
          fill: 'white',
          fontSize: 35,
          fontFamily: 'Snippet, Monaco, monospace',
          strokeThickness: 1,
          align: 'center',
        },
      }),
      new DE.SpriteRenderer({
        spriteName: 'reactor',
        y: 80,
        scale: 0.3,
        rotation: Math.PI,
      }),
    ],
    axes: { x: 0, y: 0 },
    interactive: true,
    click: function() {
      console.log('click');
    },
    checkInputs: function() {
      this.translate({ x: this.axes.x * 2, y: this.axes.y * 2 });
      DE.Tween.update(DE.Time.frameDelay);
    },
    automatisms: [['checkInputs', 'checkInputs']],
    gameObjects: [
      new DE.GameObject({
        x: 150,
        scale: 0.5,
        automatisms: [['rotate', 'rotate', { value1: -0.07 }]],
        gameObjects: [
          new DE.GameObject({
            x: 250,
            scale: 2,
            renderer: new DE.SpriteRenderer({ spriteName: 'player-bullet' }),
          }),
          new DE.GameObject({
            x: -250,
            scale: 2,
            rotation: Math.PI,
            renderer: new DE.SpriteRenderer({
              spriteName: 'player-bullet',
              loop: true,
            }),
          }),
          // this object is moving in local coords only
          new DE.GameObject({
            y: -250,
            scale: 2,
            rotation: Math.PI,
            renderer: new DE.SpriteRenderer({
              spriteName: 'player-bullet',
              loop: true,
            }),
            getCorrectMoveTo: function() {
              // console.log( this.y, this.getWorldPos().y )
              this.moveTo({ y: -this.y }, 500, null, null, true);
            },
            automatisms: [['moveTo', 'getCorrectMoveTo', { interval: 550 }]],
          }),
        ],
      }),
    ],
  });

  Game.ship.fire = function() {
    DE.Save.save('fire', DE.Save.get('fire') + 1 || 1);
    //DE.Audio.play('piew');
    var bullet = new DE.GameObject({
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      renderer: new DE.SpriteRenderer({ spriteName: 'player-bullet' }),
    });
    bullet.addAutomatism('translateY', 'translateY', { value1: -6 });
    // bullet.moveTo( { z: 10 }, 2000 );
    // bullet.addAutomatism( "rotate", "rotate", { value1: Math.random() * 0.1 } );
    // bullet.addAutomatism( "inverseAutomatism", "inverseAutomatism", { value1: "rotate", interval: 100 } );
    bullet.addAutomatism('askToKill', 'askToKill', {
      interval: 2000,
      persistent: false,
    });

    console.log('fired in total ' + DE.Save.get('fire') + ' times');
    Game.scene.add(bullet);
  };

  Game.ship2 = new DE.GameObject({
    x: 700,
    y: 640,
    renderers: [
      new DE.TextureRenderer({ spriteName: 'ship3.png' }),
      new DE.SpriteRenderer({
        spriteName: 'reactor',
        y: 80,
        scale: {x: 0.3, y: 0.3},
        rotation: Math.PI,
      }),
    ],
  });
  Game.ship2.addAutomatism('lookAt', 'lookAt', { value1: Game.ship });

  Game.heart1 = new DE.GameObject({
    x: 1600,
    y: 100,
    zindex: 10,
    renderer: new DE.TextureRenderer({ spriteName: 'heart' }),
  });
  Game.heart2 = new DE.GameObject({
    x: 1700,
    y: 100,
    zindex: 10,
    renderer: new DE.TextureRenderer({
      spriteName: 'heart',
      width: 50,
      height: 20,
    }),
  });

  var rectangle = new DE.GameObject({
    x: 800,
    y: 300,
    interactive: true,
    renderers: [
      new DE.RectRenderer(40, 70, '0xFFFF00', {
        lineStyle: [4, '0xFF3300', 1],
        fill: true,
        x: -20,
        y: -35,
      }),
      new DE.RectRenderer(40, 70, '0xF0F0F0', {
        lineStyle: [4, '0xFF3300', 1],
        fill: true,
        x: -20,
        y: -35,
        visible: false,
      }),
    ],
    pointerover: function() {
      this.renderers[1].visible = true;
      console.log('mouse over');
    },
    pointerout: function() {
      this.renderers[1].visible = false;
      console.log('mouse out');
    },
  });
  var rectangle2 = new DE.GameObject({
    x: 850,
    y: 300,
    renderer: new DE.RectRenderer(40, 70, '0xDDF0CC', {
      lineStyle: [4, '0x00F30D', 10],
      x: -20,
      y: -35,
    }),
  });

  var customShape = new DE.GameObject({
    x: 900,
    y: 300,
    renderer: new DE.GraphicRenderer(
      [
        { beginFill: '0x66CCFF' },
        { drawRect: [0, 0, 50, 50] },
        { endFill: [] },
      ],
      { x: -25, y: -25 },
    ),
  });
  Game.shapes = {
    customShape: customShape,
    rectangle: rectangle,
    rectangle2: rectangle2,
  };

  function scroller() {
    this.z -= 0.1;
    if (this.z < 2) {
      this.z = 10;
    }
  }
  for (var i = 0, a, b, c, d, e, f, g; i < 100; i += 5) {
    a = new DE.GameObject({
      _staticPosition: true,
      x: 100,
      y: 100,
      z: i * 0.1,
      renderer: new DE.RectRenderer(40, 70, '0x' + i + 'DCCFC', {
        lineStyle: [4, '0xFF3300', 1],
        fill: true,
        x: -20,
        y: -35,
      }),
    });
    a.scroller = scroller;
    a.addAutomatism('scroller', 'scroller');
    b = new DE.GameObject({
      _staticPosition: true,
      x: 1820,
      y: 100,
      z: i * 0.1,
      renderer: new DE.RectRenderer(40, 70, '0x' + i + 'DCCFC', {
        lineStyle: [4, '0xFF3300', 1],
        fill: true,
        x: -20,
        y: -35,
      }),
    });
    b.scroller = scroller;
    b.addAutomatism('scroller', 'scroller');
    c = new DE.GameObject({
      _staticPosition: true,
      x: 1820,
      y: 980,
      z: i * 0.1,
      renderer: new DE.RectRenderer(40, 70, '0x' + i + 'DCCFC', {
        lineStyle: [4, '0xFF3300', 1],
        fill: true,
        x: -20,
        y: -35,
      }),
    });
    c.scroller = scroller;
    c.addAutomatism('scroller', 'scroller');
    d = new DE.GameObject({
      _staticPosition: true,
      x: 100,
      y: 980,
      z: i * 0.1,
      renderer: new DE.RectRenderer(40, 70, '0x' + i + 'DCCFC', {
        lineStyle: [4, '0xFF3300', 1],
        fill: true,
        x: -20,
        y: -35,
      }),
    });
    d.scroller = scroller;
    d.addAutomatism('scroller', 'scroller');

    e = new DE.GameObject({
      _staticPosition: true,
      x: 960,
      y: 100,
      z: i * 0.1,
      renderer: new DE.RectRenderer(1720, 10, '0x' + i + 'DCCFC', {
        lineStyle: [4, '0xFF3300', 1],
        fill: false,
        x: -860,
        y: -5,
      }),
    });
    e.scroller = scroller;
    e.addAutomatism('scroller', 'scroller');

    f = new DE.GameObject({
      _staticPosition: true,
      x: 960,
      y: 980,
      z: i * 0.1,
      renderer: new DE.RectRenderer(1720, 10, '0x' + i + 'DCCFC', {
        lineStyle: [4, '0xFF3300', 1],
        fill: false,
        x: -860,
        y: -5,
      }),
    });
    f.scroller = scroller;
    f.addAutomatism('scroller', 'scroller');
    Game.scene.add(a, b, c, d, e, f);

    if (i % 10 == 0) {
      g = new DE.GameObject({
        _staticPosition: true,
        x: 960,
        y: 980,
        zindex: 10,
        z: i * 0.1,
        renderer: new DE.RectRenderer(10, 30, '0xFFFFFF', { x: -5, y: -15 }),
      });
      g.scroller = scroller;
      g.addAutomatism('scroller', 'scroller');

      Game.scene.add(g);
    }
  }

  var button = new DE.GameObject({
    x: 960,
    y: 100,
    zindex: 50,
    interactive: true,
    hitArea: new DE.PIXI.Rectangle(-225, -50, 450, 100),
    cursor: 'pointer',
    renderers: [
      new DE.RectRenderer(400, 80, '0xFFCDCD', {
        lineStyle: [4, '0x000000', 1],
        fill: true,
        x: -200,
        y: -40,
      }),
      new DE.TextRenderer('Camera Move: false', {
        textStyle: {
          fill: 'black',
          fontSize: 35,
          fontFamily: 'Snippet, Monaco, monospace',
          strokeThickness: 1,
          align: 'center',
        },
      }),
    ],
    pointerover: function() {
      this.renderer.updateRender({
        color: Game.moveCamera ? '0xDEFFDE' : '0xFFDEDE',
      });
    },
    pointerout: function() {
      this.renderer.updateRender({
        color: Game.moveCamera ? '0xCDFFCD' : '0xFFCDCD',
      });
    },
    pointerdown: function() {
      this.renderer.updateRender({
        color: Game.moveCamera ? '0x00FF00' : '0xFF0000',
      });
    },
    pointerup: function() {
      Game.moveCamera = !Game.moveCamera;
      this.renderers[1].text = 'Camera Move: ' + Game.moveCamera.toString();
      this.pointerover();

      if (Game.moveCamera) {
        Game.camera.focus(Game.ship, { options: { rotation: true } });
      } else {
        Game.camera.stopFocus();
      }
    },
  });

  var buttonFocusObj = new DE.GameObject({
    x: 500,
    y: 100,
    zindex: 50,
    interactive: true,
    hitArea: new DE.PIXI.Rectangle(-225, -50, 450, 100),
    cursor: 'pointer',
    renderers: [
      new DE.RectRenderer(400, 80, '0xFFCDCD', {
        lineStyle: [4, '0x000000', 1],
        fill: true,
        x: -200,
        y: -40,
      }),
      new DE.TextRenderer('Object focus: false', {
        textStyle: {
          fill: 'black',
          fontSize: 35,
          fontFamily: 'Snippet, Monaco, monospace',
          strokeThickness: 1,
          align: 'center',
        },
      }),
    ],
    pointerover: function() {
      this.renderer.updateRender({
        color: Game.focusObj ? '0xDEFFDE' : '0xFFDEDE',
      });
    },
    pointerout: function() {
      this.renderer.updateRender({
        color: Game.focusObj ? '0xCDFFCD' : '0xFFCDCD',
      });
    },
    pointerdown: function() {
      this.renderer.updateRender({
        color: Game.focusObj ? '0x00FF00' : '0xFF0000',
      });
    },
    pointerup: function() {
      Game.focusObj = !Game.focusObj;
      this.renderers[1].text = 'Object focus: ' + Game.focusObj.toString();
      this.pointerover();

      if (Game.focusObj) {
        Game.ship2.focus(Game.ship, {
          options: { rotation: true },
          offset: { x: -250, y: -250 },
        });
      } else {
        Game.ship2.stopFocus();
      }
    },
  });

  Game.scene.add(
    Game.ship,
    Game.ship2,
    Game.heart1,
    Game.heart2,
    customShape,
    rectangle,
    rectangle2,
    button,
    buttonFocusObj,
    Game.targetPointer,
  );

  DE.Inputs.on('keyDown', 'left', function() {
    Game.ship.axes.x = -2;
  });
  DE.Inputs.on('keyDown', 'right', function() {
    Game.ship.axes.x = 2;
  });
  DE.Inputs.on('keyUp', 'right', function() {
    Game.ship.axes.x = 0;
  });
  DE.Inputs.on('keyUp', 'left', function() {
    Game.ship.axes.x = 0;
  });

  DE.Inputs.on('keyDown', 'up', function() {
    Game.ship.axes.y = -2;
  });
  DE.Inputs.on('keyDown', 'down', function() {
    Game.ship.axes.y = 2;
  });
  DE.Inputs.on('keyUp', 'down', function() {
    Game.ship.axes.y = 0;
  });
  DE.Inputs.on('keyUp', 'up', function() {
    Game.ship.axes.y = 0;
  });

  DE.Inputs.on('keyDown', 'fire', function() {
    Game.ship.addAutomatism('fire', 'fire', { interval: 150 });
  });
  DE.Inputs.on('keyUp', 'fire', function() {
    Game.ship.removeAutomatism('fire');
  });

  DE.Inputs.on('keyDown', 'deep', function() {
    Game.ship.z += 0.1;
  });
  DE.Inputs.on('keyDown', 'undeep', function() {
    Game.ship.z -= 0.1;
  });
};

// just for helping debugging stuff, never do this ;)
window.Game = Game;

export default Game;
