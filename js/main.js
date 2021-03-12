const ASSETS = {
  IMG: {
    BACKGROUD: "img/backgroud.png"
  },
  SPRITES: {
    HERO_WALK: "img/sprites/hero/sprites_hero.png",
    HERO_ATTACK: "img/sprites/hero/attack.png",
    ENEMY_KNIGHT: "img/sprites/enemy/enemy_walk.png",
    ENEMY_BIRD: "img/sprites/enemy/bird/sprites_bird.png",
    ENEMY_TROLL: "img/sprites/enemy/sprites_troll.png",
    BULLET: "img/sprites/gang.png",
    COIN: "img/sprites/coins/coin.png",
    MUSHROOM: "img/sprites/mushroom.png",
  },
  SOUNDS: {
    AGLY: "sounds/agly.mp3",
    BIRD: "sounds/bird.mp3",
    BONUS: "sounds/bonus.mp3",
    COIN: "sounds/coin.mp3",
    COLLISION: "sounds/collision.mp3",
    FUNNY_JUMP: "sounds/funny_jump.mp3",
    GAME_OVER: "sounds/game_over.mp3",
    JUMP: "sounds/jump.mp3",
    NO: "sounds/no.mp3",
    OO: "sounds/oo.mp3",
    SM: "sounds/sm.mp3",
    TWIP: "sounds/twip.mp3",
    MUSHROOM: "sounds/mushroom.mp3",
    MUSHROOMS: "sounds/mash.mp3",

  }
};

const UP_KEY = "UP";
const DOWN_KEY = "DOWN";
const LEFT_KEY = "LEFT";
const RIGHT_KEY = "RIGHT";
const SPACE_KEY = "SPACE";

const PLAYER_DODIK_WIDTH = 189;
const PLAYER_DODIK_HEIGHT = 290;

const ENEMY_KNIGHT_HEIGHT = 260;
const ENEMY_BIRD_HEIGHT = 120;
const ENEMY_TROLL_HEIGHT = 260;
const COIN_HEIGHT = 80;
const MUSHROOM_HEIGHT = 90;

const PLAYER_SPEED = 0.35;
const ENTITY_SPEED = 0.25;
const BULLET_SPEED = 0.40;

const ENEMY_KNIGHT = 1;
const ENEMY_BIRD = 2;
const ENEMY_TROLL = 3;
const COIN = 4;
const MUSHROOM = 5;

const ENEMY_RAND_MAX = 200;
const COIN_RAND_MAX = 120;
const MUSHROOM_RAND_MAX = 600;

const MAX_POWER = 10;

const POWER_RECOVERY = 950; // In ms
const ATTACK_TIME = 2500; // In ms
const TRIP_TIME = 5000; // In ms

const SCORE_PER_ENEMY = 5;
const SCORE_PER_BIRD = -1;
const SCORE_PER_COIN = 15;

class SoundManager {
  constructor() {
    this.sounds = {};
  }

  load(sounds) {
    for (const [_, path] of Object.entries(sounds)) {
      let sound = new Audio();

      sound.src = path;

      this.sounds[path] = sound;
    }
  }

  play(sound) {
    if (sound in this.sounds) {
      try {
        this.sounds[sound].play();
      } catch (ex) {
        log.error(`Can't play sound: ${ex}`);
      }
    }
  }
}

class Entity {
  constructor(position, sprite) {
    this.position = position;
    this.sprite = sprite;
  }

  getPosition() {
    return this.position;
  }

  setPosition(position) {
    this.position = position;
  }

  getSprite() {
    return this.sprite;
  }
}

class Player extends Entity {
  constructor(position) {
    const sprite = new Sprite(ASSETS.SPRITES.HERO_WALK, [188, -29], [189, 290], 0.0025, [0, 1, 2, 3]);

    super(position, sprite);
  }

  setAttackMode() {
    this.sprite = new Sprite(ASSETS.SPRITES.HERO_ATTACK, [189, -25], [189, 290], 0.0030, [0, 1, 2, 3], null);
  }

  setWalkMode() {
    this.sprite = new Sprite(ASSETS.SPRITES.HERO_WALK, [188, -29], [189, 290], 0.0025, [0, 1, 2, 3]);
  }
}

class Enemy extends Entity {
  constructor(type, position) {
    let sprite = null;

    if (type == ENEMY_KNIGHT) {
      sprite = new Sprite(ASSETS.SPRITES.ENEMY_KNIGHT, [220, 78], [800, 260], 0.0025, [0, 1, 2, 3]);
    } else if (type == ENEMY_BIRD) {
      sprite = new Sprite(ASSETS.SPRITES.ENEMY_BIRD, [8, 6], [148, 120], 0.0025, [0, 1, 2, 3, 4, 5, 6]);
    } else if (type == ENEMY_TROLL) {
      sprite = new Sprite(ASSETS.SPRITES.ENEMY_TROLL, [180, 145], [800, 260], 0.0030, [0, 1, 2, 3]);
    }

    super(position, sprite);

    this.type = type;
  }

  getType() {
    return this.type;
  }
}

class Bullet extends Entity {
  constructor(position) {
    const sprite = new Sprite(ASSETS.SPRITES.BULLET, [0, 0], [126, 73], 0.0025, [0, 1, 2, 3]);

    super(position, sprite);
  }
}

class Coin extends Entity {
  constructor(position) {
    const sprite = new Sprite(ASSETS.SPRITES.COIN, [0, 0], [80, 80], 0.0025, [0, 1, 2, 3]);

    super(position, sprite);
  }
}

class Mushroom extends Entity {
  constructor(position) {
    const sprite = new Sprite(ASSETS.SPRITES.MUSHROOM, [0, 0], [103, 90], 0.0025, [0, 1, 2]);

    super(position, sprite);
  }
}

class View {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;

    this.currentShift = 0;
    this.shiftSpeed = this.canvas.width / 350;

    this.soundManager = new SoundManager();
    this.soundManager.load(ASSETS.SOUNDS);
  }

  drawGameOver(score) {
    this.context.filter = "grayscale(30%)";

    this.drawBackgroud();

    this.context.fillStyle = "red";

    this.context.font = "200px Verdana";
    this.context.fillText("☠", (this.canvas.width / 2), this.canvas.height / 3);

    this.context.font = "100px Verdana";
    this.context.fillText("Game Over 🙊", (this.canvas.width / 2) - 260, this.canvas.height / 2);

    this.context.font = "60px Verdana";
    this.context.fillText(`Score: ${score}`, (this.canvas.width / 2) - 60, (this.canvas.height / 2) + 120);
  }

  drawBackgroud() {
    this.drawImage(ASSETS.IMG.BACKGROUD, this.currentShift, 0, this.canvas.width, this.canvas.height);
    this.drawImage(ASSETS.IMG.BACKGROUD, this.currentShift + this.canvas.width, 0, this.canvas.width, this.canvas.height);

    this.currentShift = this.currentShift - this.shiftSpeed;

    if (this.currentShift <= -this.canvas.width) {
      this.currentShift = 0;
    }
  }

  drawEntity(entity) {
    this.context.save();

    const position = entity.getPosition();

    this.context.translate(position[0], position[1]); // ретранслирую позицию

    entity.getSprite().render(this.context);

    this.context.restore();
  }

  drawInfo(current_score, power) {
    const smiles = {
      50: "🤮",
      100: "🤢",
      150: "🤕",
      200: "🤒",
      250: "😴",
      300: "🤥",
      350: "🤨",
      400: "🤪",
      500: "😜",
      550: "🤩",
      600: "😘",
      650: "🙃",
      700: "😇",
      1000: "🤦",
      2000: "💘",
      10000: "🐧",
    };

    let smile = "🌝";

    for (const [score, symbols] of Object.entries(smiles)) {
      if (current_score >= score) {
        smile = symbols;
      }
    }

    this.context.fillStyle = "white";
    this.context.font = "26px Verdana";
    this.context.fillText(`Score: ${current_score} ${smile}`, 20, 40);

    let gradient = this.context.createLinearGradient(20, 0, 220, 0); //power

    gradient.addColorStop(0, '#ff70a2');
    gradient.addColorStop(0.5, '#ed2fce');
    gradient.addColorStop(1, '#3a00a3');

    this.context.fillStyle = gradient;

    this.context.fillRect(20, 50, power * 20, 20);
  }

  drawTrip(mode) {
    if (mode) {
      this.context.filter = "invert(100%)";
    } else {
      this.context.filter = "none";
    }
  }

  drawImage(path, dx, dy, dWidth, dHeight) {
    let image = new Image();

    image.src = path;

    this.context.drawImage(image, dx, dy, dWidth, dHeight);
  }

  playSound(sound) {
    return this.soundManager.play(sound);
  }
}

class Model {
  constructor(gameOverCallback) {
    this.gameOverCallback = gameOverCallback;

    this.power = MAX_POWER;
    this.score = 0;
    this.dt = 0;
  }

  start() {
    this.width = window.innerWidth * 0.99;
    this.height = window.innerHeight * 0.88;

    this.lastTime = Date.now();
    this.dt = 0;

    this.powerTime = Date.now();
    this.inAttackTime = Date.now();
    this.inTripTime = Date.now();

    this.power = MAX_POWER;
    this.isGameOver = false;
    this.isInTrip = false;
    this.score = 0;

    this.player = new Player([0, this.height - PLAYER_DODIK_HEIGHT]);

    this.enemies = [];
    this.bullets = [];
    this.coins = [];
    this.mushrooms = [];

    this.canvas = document.getElementById("area");

    if (!area) {
      console.error("Canvas area is not found!");
      return;
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.context = this.canvas.getContext("2d");

    this.view = new View(this.canvas, this.context);
  }

  process() {
    if (this.isGameOver) {
      this.view.drawGameOver(this.score);
      this.gameOverCallback();
      return;
    }

    this.handleGameTime();
    this.handlePowerTime();
    this.handleTripTime();
    this.handleAttackTime();

    this.createEnemies();
    this.createCoins();
    this.createMushrooms();
    this.processEntities();

    this.checkCollisions();

    this.view.drawBackgroud(this.canvas);
    this.view.drawTrip(this.isInTrip);
    this.view.drawInfo(this.score, this.power);

    this.drawEntities();
  }

  shoot() {
    if (this.power > 1) {
      this.view.playSound(ASSETS.SOUNDS.TWIP);

      const position = this.player.getPosition();

      var x = position[0] + this.player.getSprite().size[1] / 4;
      var y = position[1] + this.player.getSprite().size[1] / 4;

      this.bullets.push(new Bullet([x, y]));

      this.power--;

      this.player.setAttackMode();
      this.inAttackTime = Date.now();
    }
  }

  handleGameTime() {
    const now = Date.now();

    this.dt = now - this.lastTime; // 16-17 in ms
    this.lastTime = now;
  }

  handlePowerTime() {
    if ((Date.now() - this.powerTime) >= POWER_RECOVERY) { // чтобы не создавать таймер дополнительный , 950 in ms
      if (this.power < MAX_POWER) {
        this.power++;
      }
      this.powerTime = Date.now();
    }
  }

  handleAttackTime() {
    if ((Date.now() - this.inAttackTime) >= ATTACK_TIME) { 

      this.player.setWalkMode();

      this.inAttackTime = Date.now();
    }
  }

  handleTripTime() {
    if ((Date.now() - this.inTripTime) >= TRIP_TIME) {
      this.isInTrip = false;

      this.inTripTime = Date.now();
    }
  }

  createEnemies() {
    const number = this.getRandomInt(0, ENEMY_RAND_MAX);

    if (number == ENEMY_KNIGHT) {
      this.enemies.push(new Enemy(ENEMY_KNIGHT, [this.width, this.height - ENEMY_KNIGHT_HEIGHT]));
    } else if (number == ENEMY_BIRD) {
      this.enemies.push(new Enemy(ENEMY_BIRD, [this.width, ENEMY_BIRD_HEIGHT + this.getRandomInt(0, 300)]));

      this.view.playSound(ASSETS.SOUNDS.BIRD);
    } else if (number == ENEMY_TROLL) {
      this.enemies.push(new Enemy(ENEMY_TROLL, [this.width, this.height - ENEMY_TROLL_HEIGHT]));
    }
  }

  createCoins() {
    const number = this.getRandomInt(0, COIN_RAND_MAX);

    if (number == COIN) {
      this.coins.push(new Coin([this.width, this.height - COIN_HEIGHT - this.getRandomInt(10, this.height / 2)]));
    }
  }

  createMushrooms() {
    const number = this.getRandomInt(0, MUSHROOM_RAND_MAX);

    if (number == MUSHROOM) {
      this.mushrooms.push(new Mushroom([this.width, this.height - MUSHROOM_HEIGHT - this.getRandomInt(0, this.height / 6)]));
    }
  }

  processEntities() {
    this.player.getSprite().update(this.dt); // отрисовываю героя каждый dt

    for (let enemy of this.enemies) {
      enemy.getSprite().update(this.dt); // отрисовываю каждого врага в массиве

      let position = enemy.getPosition();

      position[0] -= ENTITY_SPEED * this.dt;

      enemy.setPosition(position);
    }

    for (let bullet of this.bullets) {
      bullet.getSprite().update(this.dt);

      let position = bullet.getPosition();

      position[0] += BULLET_SPEED * this.dt;

      bullet.setPosition(position);
    }

    // Remove bullets
    for (let i = 0; i < this.bullets.length; i++) {
      let position = this.bullets[i].getPosition();

      if (position[1] < 0 || position[1] > this.height || position[0] > this.width) {
        this.bullets.splice(i--, 1);
      }
    }

    for (let coin of this.coins) {
      coin.getSprite().update(this.dt);

      let position = coin.getPosition();

      position[0] -= ENTITY_SPEED * this.dt;

      coin.setPosition(position);
    }

    for (let mushroom of this.mushrooms) {
      mushroom.getSprite().update(this.dt);

      let position = mushroom.getPosition();

      position[0] -= ENTITY_SPEED * this.dt;

      mushroom.setPosition(position);
    }
  }

  checkPlayerBounds() {
    let position = this.player.getPosition();

    if (position[0] < 0) { // обработка выхода персонажа за экран
      position[0] = 0;
    } else if (position[0] > this.width - this.player.getSprite().size[0]) {
      position[0] = this.width - this.player.getSprite().size[0];
    }

    if (position[1] < 0) {
      position[1] = 0;
    } else if (position[1] > this.height - this.player.getSprite().size[1]) {
      position[1] = this.height - this.player.getSprite().size[1];
    }

    this.player.setPosition(position);
  }

  checkCollisions() {
    for (let i = 0; i < this.enemies.length; i++) { // collision enemy and bullets
      const position = this.enemies[i].getPosition();
      const spriteSize = this.enemies[i].getSprite().size;

      for (let j = 0; j < this.bullets.length; j++) {
        var bulletPosition = this.bullets[j].getPosition();
        var bulletSpriteSize = this.bullets[j].getSprite().size;

        if (this.boxCollides(position, spriteSize, bulletPosition, bulletSpriteSize)) {
          this.view.playSound(ASSETS.SOUNDS.AGLY);
          this.view.playSound(ASSETS.SOUNDS.SM);

          if (!this.enemies[i])
            continue;

          if (this.enemies[i].getType() == ENEMY_BIRD) {
            this.score += SCORE_PER_BIRD;
          } else {
            this.score += SCORE_PER_ENEMY;
          }

          this.enemies.splice(i, 1);
          this.bullets.splice(j, 1);

          i -= 1;
        }
      }

      if (this.boxCollides(position, spriteSize, this.player.getPosition(), this.player.getSprite().size)) {
        if (!this.isInTrip) {
          this.view.playSound(ASSETS.SOUNDS.GAME_OVER);

          this.isGameOver = true;
        }
      }
    }

    const position = this.player.getPosition();
    const spriteSize = this.player.getSprite().size;

    for (let j = 0; j < this.coins.length; j++) {
      var coinPosition = this.coins[j].getPosition();
      var coinSpriteSize = this.coins[j].getSprite().size;

      if (this.boxCollides(position, spriteSize, coinPosition, coinSpriteSize)) { // collision hero and coin
        this.view.playSound(ASSETS.SOUNDS.COIN);

        this.coins.splice(j, 1);

        j -= 1;

        this.score += SCORE_PER_COIN;
      }
    }

    for (let k = 0; k < this.mushrooms.length; k++) { // collision hero and mashroom
      var mushroomPosition = this.mushrooms[k].getPosition();
      var mushroomSpriteSize = this.mushrooms[k].getSprite().size;

      if (this.boxCollides(position, spriteSize, mushroomPosition, mushroomSpriteSize)) {
        this.view.playSound(ASSETS.SOUNDS.MUSHROOMS);
        this.player.setAttackMode()
        this.mushrooms.splice(k, 1);

        this.inTripTime = Date.now();
        this.isInTrip = true;

        k -= 1;
      }
    }
  }

  drawEntities() {
    this.view.drawEntity(this.player);

    for (const enemy of this.enemies) {
      this.view.drawEntity(enemy);
    }

    for (const bullet of this.bullets) {
      this.view.drawEntity(bullet);
    }

    for (const coin of this.coins) {
      this.view.drawEntity(coin);
    }

    for (const mushroom of this.mushrooms) {
      this.view.drawEntity(mushroom);
    }
  }

  collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 || b <= y2 || y > b2);
  }

  boxCollides(pos1, size1, pos2, size2) {
    return this.collides(
      pos1[0], pos1[1],
      pos1[0] + size1[0],
      pos1[1] + size1[1],
      pos2[0], pos2[1],
      pos2[0] + size2[0],
      pos2[1] + size2[1]
    );
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

class Controller {
  constructor(saveResultCallback) {
    this.isRun = false;

    this.saveResultCallback = saveResultCallback;

    this.model = new Model(this.gameOverCallback.bind(this));

    this.loop = this.loop.bind(this);
  }

  start() {
    if (this.isRun) {
      return;
    }

    this.model.start();

    this.loadResources(this.loop);

    this.isRun = true;
  }

  stop() {
    this.isRun = false;

    resources.remove();
  }

  loop() {
    try {
      if (!this.isRun) {
        return;
      }

      this.model.process();
      this.handleInput();

      requestAnimationFrame(this.loop);
    } catch (ex) {
      console.log(`Handle error: ${ex}`);
    }
  }

  gameOverCallback() {
    let name;

    do {
      name = prompt("What is your name, dude?");
    } while (!name);

    this.saveResultCallback(name, this.model.score);

    this.isRun = false;
  }

  handleInput() {
    if (input.isDown(UP_KEY)) {
      const position = this.model.player.getPosition();

      position[1] -= PLAYER_SPEED * this.model.dt;

      this.model.player.setPosition(position);
    }

    if (input.isDown(DOWN_KEY)) {
      const position = this.model.player.getPosition();

      position[1] += PLAYER_SPEED * this.model.dt;

      this.model.player.setPosition(position);
    }

    if (input.isDown(LEFT_KEY)) {
      const position = this.model.player.getPosition();

      position[0] -= PLAYER_SPEED * this.model.dt;

      this.model.player.setPosition(position);
    }

    if (input.isDown(RIGHT_KEY)) {
      const position = this.model.player.getPosition();

      position[0] += PLAYER_SPEED * this.model.dt;

      this.model.player.setPosition(position);
    }

    if (input.isDown(SPACE_KEY)) {
      this.model.shoot();
    }

    this.model.checkPlayerBounds();
  }

  loadResources(callback) {
    let assets = Object.values(ASSETS.SPRITES);

    assets.push(ASSETS.IMG.BACKGROUD);

    resources.load(assets);
    resources.onReady(callback);
  }
}

class Game {
  constructor(saveResultCallback) {
    this.controller = new Controller(saveResultCallback);
  }

  start() {
    this.controller.start();
  }

  stop() {
    this.controller.stop();
  }
}