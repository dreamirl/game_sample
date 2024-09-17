/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game declaration
**/
import DE from '@dreamirl/dreamengine';

let camera: DE.Camera;
let render: DE.Render;
let scene: DE.Scene;
let ship: DE.GameObject;
let ship2: DE.GameObject;
let obj: DE.GameObject;
let targetPointer: DE.GameObject;
let shapes: any;
let isObjectFocused = false;
let isMoveCameraActive = false;

// init
function init() {
  console.log('game init');
  // DE.config.DEBUG = 1;
  // DE.config.DEBUG_LEVEL = 2;

  // Create the renderer before assets start loading
  render = new DE.Render('render', {
    resizeMode: 'stretch-ratio',
    width: 1920,
    height: 1080,
    backgroundColor: '0x00004F',
    roundPixels: true,
    powerPreferences: 'high-performance',
    scaleMode: DE.PIXI.SCALE_MODES.NEAREST,
    antialias: false,
  });
  render.init();

  DE.start();
}

function onload() {
  console.log('game start');

  // scene
  scene = new DE.Scene('demoScene');

  camera = new DE.Camera(0, 0, 1920, 1080, {
    scene,
    backgroundImage: 'bg',
  });
  camera.interactive = true;

  // TODO: this one does not work anymore
  camera.pointermove = function (pos, e) {
    targetPointer.moveTo(pos, 100);
  };
  camera.pointerdown = function (pos, e) {
    ship.gameObjects[0].moveTo(targetPointer, 500);
    // targetPointer.shake( 10, 10, 200 );
    targetPointer.renderer.setBrightness([1, 0]);
  };
  camera.pointerup = function (pos, e) {
    console.log('up');
    targetPointer.shake(10, 10, 200);
  };
  render.add(camera);

  targetPointer = new DE.GameObject({
    zIndex: 500,
    renderer: new DE.SpriteRenderer({ spriteName: 'target', scale: 0.3 }),
  });

  ship;
  ship2;

  // WIP working on a simple "AnimatedSprite" declaration
  // var imgs = ["ship1.png","ship2.png","ship3.png","ship4.png","ship5.png","ship6.png"];
  // var textureArray = [];

  // for (var i=0; i < imgs.length; i++)
  // {
  //   var texture = PIXI.utils.TextureCache[imgs[i]];
  //   textureArray.push(texture);
  // };

  // var mc = new PIXI.extras.AnimatedSprite(textureArray);

  ship = new DE.GameObject({
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
    click: function () {
      console.log('click');
    },
    checkInputs: function () {
      this.translate({ x: this.axes.x * 2, y: this.axes.y * 2 });
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
            getCorrectMoveTo: function () {
              // console.log( this.y, this.getWorldPos().y )
              this.moveTo({ y: -this.y }, 500, null, null, true);
            },
            automatisms: [['moveTo', 'getCorrectMoveTo', { interval: 550 }]],
          }),
        ],
      }),
    ],
  });

  ship.fire = function () {
    DE.Save.save('fire', DE.Save.get('fire') + 1 || 1);
    DE.Audio.play('piew');
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
    scene.add(bullet);
  };

  ship2 = new DE.GameObject({
    x: 700,
    y: 640,
    renderers: [
      new DE.TextureRenderer({ spriteName: 'ship3.png' }),
      new DE.SpriteRenderer({
        spriteName: 'reactor',
        y: 80,
        scale: 0.3,
        rotation: Math.PI,
      }),
    ],
  });
  ship2.addAutomatism('lookAt', 'lookAt', { value1: ship });

  let heart1 = new DE.GameObject({
    x: 1600,
    y: 100,
    zIndex: 10,
    renderer: new DE.TextureRenderer({ spriteName: 'heart' }),
  });
  let heart2 = new DE.GameObject({
    x: 1700,
    y: 100,
    zIndex: 10,
    renderer: new DE.TextureRenderer({
      spriteName: 'heart',
      width: 50,
      height: 20,
    }),
  });

  let rectangle = new DE.GameObject({
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
    pointerover: function () {
      this.renderers[1].visible = true;
      console.log('mouse over');
    },
    pointerout: function () {
      this.renderers[1].visible = false;
      console.log('mouse out');
    },
  });
  let rectangle2 = new DE.GameObject({
    x: 850,
    y: 300,
    renderer: new DE.RectRenderer(40, 70, 0xddf0cc, {
      lineStyle: [4, 0x00f30d, 10],
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
  shapes = {
    customShape: customShape,
    rectangle: rectangle,
    rectangle2: rectangle2,
  };

  // TODO: z has been deprecated because it's not really useful
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
    scene.add(a, b, c, d, e, f);

    if (i % 10 == 0) {
      g = new DE.GameObject({
        _staticPosition: true,
        x: 960,
        y: 980,
        zindex: 10,
        z: i * 0.1,
        renderer: new DE.RectRenderer(10, 30, 0xffffff, { x: -5, y: -15 }),
      });
      g.scroller = scroller;
      g.addAutomatism('scroller', 'scroller');

      scene.add(g);
    }
  }

  //TODO Make the japanese character works
  // let description = 'こんにちは、みんな';
  let description =
    'A large bat, visibly aggressive under the influence of the power of Gold.';

  let testBat = new DE.GameObject({
    x: 850,
    y: 750,
    renderer: new DE.BitmapTextRenderer(description, {
      fontName: 'NoreyaBitmap',
      fontSize: 40,
      tint: 0xffffff,
    }),
  });

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
    pointerover: function () {
      this.renderer.updateRender({
        color: isMoveCameraActive ? '0xDEFFDE' : '0xFFDEDE',
      });
    },
    pointerout: function () {
      this.renderer.updateRender({
        color: isMoveCameraActive ? '0xCDFFCD' : '0xFFCDCD',
      });
    },
    pointerdown: function () {
      this.renderer.updateRender({
        color: isMoveCameraActive ? '0x00FF00' : '0xFF0000',
      });
    },
    pointerup: function () {
      isMoveCameraActive = !isMoveCameraActive;
      this.renderers[1].text = 'Camera Move: ' + isMoveCameraActive.toString();
      this.pointerover();

      if (isMoveCameraActive) {
        camera.focus(ship, { options: { rotation: true } });
      } else {
        camera.target = undefined;
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
      new DE.BitmapTextRenderer('Object focus: false', {
        fontName: 'NoreyaBitmap',
        fontSize: 50,
        tint: '0x000000',
      }),
    ],
    pointerover: function () {
      this.renderer.updateRender({
        color: isObjectFocused ? '0xDEFFDE' : '0xFFDEDE',
      });
    },
    pointerout: function () {
      this.renderer.updateRender({
        color: isObjectFocused ? '0xCDFFCD' : '0xFFCDCD',
      });
    },
    pointerdown: function () {
      this.renderer.updateRender({
        color: isObjectFocused ? '0x00FF00' : '0xFF0000',
      });
    },
    pointerup: function () {
      isObjectFocused = !isObjectFocused;
      this.renderers[1].text = 'Object focus: ' + isObjectFocused.toString();
      this.pointerover();

      if (isObjectFocused) {
        ship2.focus(ship, {
          options: { rotation: true },
          offsets: { x: -250, y: -250 },
        });
      } else {
        ship2.stopFocus();
      }
    },
  });

  scene.add(
    ship,
    ship2,
    heart1,
    heart2,
    customShape,
    rectangle,
    rectangle2,
    button,
    buttonFocusObj,
    targetPointer,
    testBat,
  );

  DE.Inputs.on('keyDown', 'left', function () {
    ship.axes.x = -2;
  });
  DE.Inputs.on('keyDown', 'right', function () {
    ship.axes.x = 2;
  });
  DE.Inputs.on('keyUp', 'right', function () {
    ship.axes.x = 0;
  });
  DE.Inputs.on('keyUp', 'left', function () {
    ship.axes.x = 0;
  });

  DE.Inputs.on('keyDown', 'up', function () {
    ship.axes.y = -2;
  });
  DE.Inputs.on('keyDown', 'down', function () {
    ship.axes.y = 2;
  });
  DE.Inputs.on('keyUp', 'down', function () {
    ship.axes.y = 0;
  });
  DE.Inputs.on('keyUp', 'up', function () {
    ship.axes.y = 0;
  });

  DE.Inputs.on('keyDown', 'fire', function () {
    ship.addAutomatism('fire', 'fire', { interval: 150 });
  });
  DE.Inputs.on('keyUp', 'fire', function () {
    ship.removeAutomatism('fire');
  });

  DE.Inputs.on('keyDown', 'deep', function () {
    ship.z += 0.1;
  });
  DE.Inputs.on('keyDown', 'undeep', function () {
    ship.z -= 0.1;
  });
}

export default {
  init,
  onload,
};
