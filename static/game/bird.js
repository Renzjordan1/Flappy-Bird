class Bird {
  constructor(x, y, w, color, ai, brain) {
    this.animation = [
      { sX: 276, sY: 112 },
      { sX: 276, sY: 139 },
      { sX: 276, sY: 164 },
      { sX: 276, sY: 139 }
    ];
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 26;
    this.radius = w / 2;
    this.frame = 0;

    //BIRD JUMPING SPEEDS
    this.gravity = 0.5;
    this.speed = 0;
    this.jump = 6;
    if (color == "yellow") {
      this.sprite = sprite;
    } else {
      this.sprite = sprite2;
    }
    this.death = false;
    this.ai = ai;
    this.fitness = 0;
    this.score = 0;
    this.die = 0;
    this.ground = false;
    this.life;

    //AI
    if (this.ai) {
      if (brain) {
        this.brain = brain.copy();
      } else {
        this.brain = new NeuralNetwork(5, 8, 2);
      }
    }
  }

  draw() {
    let bird = this.animation[this.frame];
    ctx.drawImage(
      this.sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      this.x - this.w / 2,
      this.y - this.h / 2,
      this.w,
      this.h
    );
  }

  flap() {
    this.speed = -this.jump;
  }

  crossover(parent) {
    this.brain = this.brain.crossover(parent.brain);
  }

  mutate() {
    this.brain.mutate(0.1);
  }

  mid(pipes) {
    //FIND CLOSEST PIPE
    let closest = pipes[0];
    let closestD = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = pipes[i][0] - (this.x + this.radius);
      // console.log(closest);
      if (d < closestD && pipes[i][0] + pipe.w >= this.x) {
        closest = pipes[i];
        closestD = d;
      }
    }

    // console.log(closest);

    this.score +=
      5000 / Math.abs(closest[1] + pipe.h + pipe.gap / 2 - this.y) + 0.0001;
    console.log(
      5000 / Math.abs(closest[1] + pipe.h + pipe.gap / 2 - this.y) + 0.0001
    );
  }

  think(pipes) {
    //FIND CLOSEST PIPE
    let closest = null;
    let closestD = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = pipes[i][0] - (this.x + this.radius);
      if (d < closestD && pipes[i][2] == 0) {
        closest = pipes[i];
        closestD = d;
      }
    }

    let inputs = [];
    inputs[0] = this.y / cvs.height;
    inputs[1] = (closest[1] + pipe.h) / cvs.height;
    inputs[2] = (closest[1] + pipe.h + pipe.gap) / cvs.height;
    inputs[3] = closest[0] / cvs.width;
    inputs[4] = this.speed / 10;

    let output = this.brain.predict(inputs);

    if (output[0] > output[1]) {
      this.flap();
    }
  }

  dispose() {
    this.brain.dispose();
  }

  update() {
    // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
    this.period = state.current == state.getReady ? 10 : 5;
    // WE INCREMENT THE FRAME BY 1, EACH PERIOD
    this.frame += frames % this.period == 0 ? 1 : 0;
    // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
    this.frame = this.frame % this.animation.length;

    //GRAVITY ALWAYS IN EFFECT
    this.speed += this.gravity;

    //BIRD MOVE
    this.y += this.speed;

    if (this.death == false) {
      this.life++;
    }

    //BIRD HITS GROUND
    if (this.y + this.radius >= fg.y) {
      this.y = fg.y - this.h / 2;
      // console.log("HIT GROUND");
      this.death = true;
      if (this.ground == false) {
        DIE.play();
        this.ground = true;
      }
    }
    //BIRD HIT TOP
    if (this.y - this.radius <= 0) {
      // console.log("HIT SKY");
      this.speed = 0;
      this.death = true;
      HIT.play();
    }
  }

  reset() {
    this.x = cvs.width / 2;
    this.y = cvs.height / 2;
    this.speed = 0;
    this.gravity = 0.5;
    this.ground = false;
    this.die = 0;
  }

  score1() {
    this.score = 0;
    this.life = 0;
  }
}
