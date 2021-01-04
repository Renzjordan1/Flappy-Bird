//SELECT CVS
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

//GAME VARS AND CONSTS
let frames = 0;
var deaths = 0;
var players = 0;
var robots = 0;
var i = 0;
var birdList = [];
var botList = [];
var oldList = [];
try {
  var best = localStorage.getItem("high");
} catch (e) {
  console.log(e);
  var best = 0;
}

var generation = 1;
var time = 0;
var EASY = new NeuralNetwork(5, 8, 2);
var MEDIUM = new NeuralNetwork(5, 8, 2);
var HARD = new NeuralNetwork(5, 8, 2);
var IMPOSSIBLE = new NeuralNetwork(5, 8, 2);
var evo = false;
var evoBest = 0;

(async function() {
  console.log("hello");
  let model = await tf.loadLayersModel(
    "/models/modelsEASY.json"
  );
  let x = model.getWeights();
  EASY.model.setWeights(x);
})();

(async function() {
  console.log("hello");
  let model = await tf.loadLayersModel(
    "/models/modelsMEDIUM.json"
  );
  let x = model.getWeights();
  MEDIUM.model.setWeights(x);
})();

(async function() {
  console.log("hello");
  let model = await tf.loadLayersModel(
    "/models/modelsHARD.json"
  );
  let x = model.getWeights();
  HARD.model.setWeights(x);
})();

(async function() {
  console.log("hello");
  let model = await tf.loadLayersModel(
    "/models/modelsIMPOSSIBLE.json"
  );
  let x = model.getWeights();
  IMPOSSIBLE.model.setWeights(x);
})();

//LOAD SPRITE
const sprite = new Image();
sprite.src = "img/sprite.png";

const sprite2 = new Image();
sprite2.src = "img/sprite2.png";

// LOAD SOUNDS
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

// GAME STATE
const state = {
  current: 3,
  getReady: 0,
  game: 1,
  over: 2,
  menu: 3,
  difficult: 4
};

//CONTROL THE GAME
cvs.addEventListener("click", function(evt) {
  //PLAYING
  let rect = cvs.getBoundingClientRect();
  let clickX = evt.clientX - rect.left;
  let clickY = evt.clientY - rect.top;
  switch (state.current) {
    //GAME OVER
    case state.over:
      if (
        clickX >= restart.x &&
        clickX <= restart.x + restart.w &&
        clickY >= restart.y &&
        clickY <= restart.y + restart.h
      ) {
        //RESET GAME
        // console.log("reset");
        for (i = 0; i < birdList.length; i++) {
          birdList[i].reset();
          birdList[i].death = false;
        }
        for (var i = 0; i < botList.length; i++) {
          botList[i].reset();
          if (botList[i].death == true) {
            botList[i].death = false;
          }
        }
        pipe.reset();
        state.current = state.game;
        for (var i = 0; i < botList.length; i++) {
          botList[i].score1();
        }
        // if (evo) {
        //   nextGeneration();
        // }
        score.reset();
      }
      //GO TO MAIN MENU
      else if (
        clickX >= back.x &&
        clickX <= back.x + back.w &&
        clickY >= back.y &&
        clickY <= back.y + back.h
      ) {
        // console.log("reset");
        pipe.reset();
        score.reset();
        state.current = state.menu;
        evo = false;
        players = 0;
        robots = 0;
        birdList = [];
        botList = [];
      } else if (
        clickX >= leader.x &&
        clickX <= leader.x + leader.w &&
        clickY >= leader.y &&
        clickY <= leader.y + leader.h
      ) {
        localStorage.setItem("points", score.value);
        window.location = "name";
      }
      break;

    case state.menu:
      //PLAY 1 PLAYER
      if (
        clickX >= onePlayer.x &&
        clickX <= onePlayer.w &&
        clickY >= onePlayer.y &&
        clickY <= onePlayer.y + onePlayer.h
      ) {
        state.current = state.game;
        players = 1;
        robots = 0;
        birdList = [];
        botList = [];
      }

      //PLAY 2 PLAYER
      if (
        clickX >= localPlayer.x &&
        clickX <= localPlayer.w &&
        clickY >= localPlayer.y &&
        clickY <= localPlayer.y + localPlayer.h
      ) {
        state.current = state.difficult;
      }

      // //EVOLUTION
      // if (
      //   clickX >= evoPlayer.x &&
      //   clickX <= evoPlayer.w &&
      //   clickY >= evoPlayer.y &&
      //   clickY <= evoPlayer.y + evoPlayer.h
      // ) {
      //   state.current = state.game;
      //   evo = true;
      //   players = 0;
      //   robots = 250;
      //   birdList = [];
      //   botList = [];
      // }
      for (var i = 0; i < players; i++) {
        birdList.push(
          new Bird(cvs.width / 2, cvs.height / 2, 34, "yellow", false)
        );
      }
      // for (var i = 0; i < robots; i++) {
      //   botList.push(new Bird(cvs.width / 2, cvs.height / 2, 34, "blue", true));
      // }
      // break;

      //2P VS
      if (
        clickX >= evoPlayer.x &&
        clickX <= evoPlayer.w &&
        clickY >= evoPlayer.y &&
        clickY <= evoPlayer.y + evoPlayer.h
      ) {
        players = 2;
        robots = 0;
        birdList = [
          new Bird(cvs.width / 2, cvs.height / 2, 34, "yellow", true)
        ];
        botList = [];
        state.current = state.game;
        for (var i = 0; i < players - 1; i++) {
          birdList.push(
            new Bird(cvs.width / 2, cvs.height / 2, 34, "blue", false)
          );
        }
      }

      break;


    case state.difficult:
      if (
        clickX >= easyMode.x &&
        clickX <= easyMode.w &&
        clickY >= easyMode.y &&
        clickY <= easyMode.y + easyMode.h
      ) {
        players = 1;
        robots = 1;
        birdList = [];
        botList = [
          new Bird(cvs.width / 2, cvs.height / 2, 34, "blue", true, EASY)
        ];
        state.current = state.game;
      }

      if (
        clickX >= medMode.x &&
        clickX <= medMode.w &&
        clickY >= medMode.y &&
        clickY <= medMode.y + medMode.h
      ) {
        players = 1;
        robots = 1;
        birdList = [];
        botList = [
          new Bird(cvs.width / 2, cvs.height / 2, 34, "blue", true, MEDIUM)
        ];
        state.current = state.game;
      }
      if (
        clickX >= hardMode.x &&
        clickX <= hardMode.w &&
        clickY >= hardMode.y &&
        clickY <= hardMode.y + hardMode.h
      ) {
        players = 1;
        robots = 1;
        birdList = [];
        botList = [
          new Bird(cvs.width / 2, cvs.height / 2, 34, "blue", true, HARD)
        ];
        state.current = state.game;
      }
      if (
        clickX >= impossibleMode.x &&
        clickX <= impossibleMode.w &&
        clickY >= impossibleMode.y &&
        clickY <= impossibleMode.y + impossibleMode.h
      ) {
        players = 1;
        robots = 1;
        birdList = [];
        botList = [
          new Bird(cvs.width / 2, cvs.height / 2, 34, "blue", true, IMPOSSIBLE)
        ];
        state.current = state.game;
      }
      // if (
      //   !(
      //     clickX >= impossibleMode.x &&
      //     clickX <= impossibleMode.w &&
      //     clickY >= impossibleMode.y &&
      //     clickY <= impossibleMode.y + impossibleMode.h
      //   )
      // ) {
        for (var i = 0; i < players; i++) {
          birdList.push(
            new Bird(cvs.width / 2, cvs.height / 2, 34, "yellow", false)
          );
        }
        for (var i = 0; i < robots - 1; i++) {
          botList.push(
            new Bird(cvs.width / 2, cvs.height / 2, 34, "blue", true)
          );
        }
      // } else {
      //   for (var i = 0; i < players - 1; i++) {
      //     birdList.push(
      //       new Bird(cvs.width / 2, cvs.height / 2, 34, "blue", false)
      //     );
      //   }
      // }
      console.log(birdList, botList);
      break;

      case state.game:
        if (birdList[0].death == false) {
            birdList[0].flap();
            FLAP.play();
          }
      break;

  }
});

//MOVE BIRD
window.addEventListener("keydown", check, false);
function check(e) {
  var code = e.keyCode;
  switch (state.current) {
    case state.game:
      switch (code) {
        case 32: //SPACE
          if (birdList[0].death == false) {
            birdList[0].flap();
            FLAP.play();
          }
          break;
        case 13: //ENTER
          if (birdList.length > 1) {
            if (birdList[1].death == false) {
              birdList[1].flap();
              FLAP.play();
            }
          }
          break;
        case 27: //ESC
          if (evo) {
            evo = false;
            generation = 1;
            pipe.reset();
            score.reset();
            state.current = state.menu;
            players = 0;
            robots = 0;
            birdList = [];
            botList = [];
          }
          break;
        // default:
        //   alert(code); //Everything else
      }
      break;
    case state.over:
      switch (code) {
        case 27:
          pipe.reset();
          score.reset();
          state.current = state.menu;
          players = 0;
          robots = 0;
          birdList = [];
          botList = [];
          break;
      }
      break;
    case state.difficult:
      switch (code) {
        case 27:
          pipe.reset();
          score.reset();
          state.current = state.menu;
          players = 0;
          robots = 0;
          birdList = [];
          botList = [];
          break;
      }
      break;
  }
}

//BACKGROUND
const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,

  draw: function() {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  }
};

//FOREGROUND
const fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 60,
  x: 0,
  y: cvs.height - 60,

  draw: function() {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  }
};

//CREATE MENU BUTTONS
var offSet = 0.275;
const onePlayer = new menuBox(0, 0.1, cvs.width, cvs.height / 4, "1-PLAYER", 0);
const localPlayer = new menuBox(
  0,
  0.1,
  cvs.width,
  cvs.height / 4,
  "VS. CPU",
  offSet
);
const evoPlayer = new menuBox(
  0,
  0.1,
  cvs.width,
  cvs.height / 4,
  "LOCAL 2-Player VS.",
  2 * offSet
);

var offSet2 = 0.20625;
const easyMode = new menuBox(0, 0.1, cvs.width, cvs.height / 5, "EASY", 0);
const medMode = new menuBox(
  0,
  0.1,
  cvs.width,
  cvs.height / 5,
  "MEDIUM",
  offSet2
);
const hardMode = new menuBox(
  0,
  0.1,
  cvs.width,
  cvs.height / 5,
  "HARD",
  2 * offSet2
);

const impossibleMode = new menuBox(
  0,
  0.1,
  cvs.width,
  cvs.height / 5,
  "IMPOSSIBLE",
  3 * offSet2
);

const menu = {
  draw: function() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    //DRAW 1PLAyER BUTTON
    onePlayer.draw("35px Teko");
    //DRAW LOCAL PLAyER BUTTON
    localPlayer.draw("35px Teko");
    //DRAW ONLINE PLAyER BUTTON
    evoPlayer.draw("35px Teko");
  }
};

const difficult = {
  draw: function() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    //DRAW 1PLAyER BUTTON
    easyMode.draw("30px Teko");
    //DRAW LOCAL PLAyER BUTTON
    medMode.draw("30px Teko");
    //DRAW ONLINE PLAyER BUTTON
    hardMode.draw("30px Teko");

    impossibleMode.draw("30px Teko");
  }
};

//PIPE
var h = 400;
var gap = 95;
const pipe = {
  //STORE PIPE POSITIONS (MAX 2)
  position: [
    [cvs.width + 100, Math.floor((Math.random()*(.75-.25)+.25)* (fg.y - gap) + -h), 0]
  ],

  top: {
    sX: 553,
    sY: 0
  },
  bottom: {
    sX: 502,
    sY: 0
  },

  w: 53,
  h: h,
  gap: gap,
  speed: 3,
  hit: 0,

  draw: function() {
    //DRAW EACH PIPE
    for (var i = 0; i < this.position.length; i++) {
      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        this.position[i][0],
        this.position[i][1],
        this.w,
        this.h
      );
      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        this.position[i][0],
        this.position[i][1] + this.gap + this.h,
        this.w,
        this.h
      );
    }
  },

  update: function() {
    for (var i = 0; i < this.position.length; i++) {
      for (var j = 0; j < birdList.length; j++) {
        let bird = birdList[j];
        if (bird.death == true) {
          continue;
        }

        //BIRD HITS PIPE
        if (
          bird.x + bird.radius >= this.position[i][0] &&
          bird.x + bird.radius <= this.position[i][0] + this.w
        ) {
          //BIRD HITS TOP PIPE
          if (
            bird.y - bird.radius >= this.position[i][1] &&
            bird.y - bird.radius <= this.position[i][1] + this.h
          ) {
            // console.log("HIT TOP");
            bird.speed = 0;

            bird.death = true;

            HIT.play();
          }
          //BIRD HITS BOTTOM PIPE
          else if (
            bird.y + bird.radius >=
            this.position[i][1] + this.h + this.gap
          ) {
            // console.log("HIT BOTTOM");
            bird.speed = 0;

            bird.death = true;
            HIT.play();
          }
        }
      }
      for (var j = 0; j < botList.length; j++) {
        let bird = botList[j];
        if (bird.death == true) {
          continue;
        }

        //BIRD HITS PIPE
        if (
          bird.x + bird.radius >= this.position[i][0] &&
          bird.x + bird.radius <= this.position[i][0] + this.w
        ) {
          //BIRD HITS TOP PIPE
          if (
            bird.y - bird.radius >= this.position[i][1] &&
            bird.y - bird.radius <= this.position[i][1] + this.h
          ) {
            console.log("HIT TOP");

            bird.speed = 0;

            bird.death = true;

            HIT.play();
            // console.log("noise");
          }
          //BIRD HITS BOTTOM PIPE
          else if (
            bird.y + bird.radius >=
            this.position[i][1] + this.h + this.gap
          ) {
            // console.log("HIT BOTTOM");

            bird.speed = 0;

            bird.death = true;

            HIT.play();
            // console.log("noise");
          }
        }
      }

      if (i == 0) {
        //IF THE FIRST PIPE PASSES THE BIRD THEN MAKE A NEW ONE
        if (
          this.position[i][0] <= cvs.width / 2 - this.w &&
          this.position[i][2] == 0
        ) {
          this.position.push([
            cvs.width,
            Math.floor((Math.random()*(.75-.25)+.25) * (fg.y - 95) + -400),
            0
          ]);

          this.position[i][2] = 1;

          //INCREASE SCORE
          score.update();
        }

        //REMOVE PIPES OFF SCREEN
        if (this.position[i][0] <= 0 - this.w) {
          this.position.splice(0, 1);
        }
      }

      //MOVE PIPES TOWARDS LEFT
      this.position[i][0] -= this.speed;
    }
  },

  reset: function() {
    this.position = [
      [cvs.width + 100, Math.floor((Math.random()*(.75-.25)+.25) * (fg.y - 95) + -400), 0]
    ];
    this.speed = 3;
    this.hit = 0;
  }
};

//DEATH
function death() {
  var deaths = 0;
  if (state.current != state.difficult) {
    for (i = 0; i < birdList.length; i++) {
      if (birdList[i].death == true) {
        deaths++;
        if (state.current == state.game) {
          birdList[i].x -= 3;
        }
      }
    }

    for (i = 0; i < botList.length; i++) {
      if (botList[i].death == true) {
        // console.log("death");
        // if (botList[i].die == 0) {
        //   // deaths++;
        // }
        if (evo) {
          if (botList[i].die == 0) {
            botList[i].mid(pipe.position);
            botList[i].die = 1;
          }
          deaths++;
        }

        if (state.current == state.game) {
          botList[i].x -= 3;
        }
      }
    }
    if (evo == false) {
      if (deaths == birdList.length) {
        for (i = 0; i < botList.length; i++) {
          oldList[i] = botList[i];
        }
        // console.log("death");
        state.current = state.over;
        // console.log(birdList);
        // console.log("death");
        best = Math.max(score.value, best);
        localStorage.setItem("high", best);
      }
    } else {
      if (deaths == botList.length) {
        for (i = 0; i < botList.length; i++) {
          oldList[i] = botList[i];
        }

        state.current = state.over;
        // console.log("death");
        evoBest = Math.max(score.value, evoBest);
      }
    }
  }
}

//MENU
var w = 225;
var x = cvs.width / 2 - w / 2;
const restart = new overBox(x + 15, 90, 95, 35, "RESTART", 60);
const back = new overBox(x + 15, 90, 95, 35, "MENU", 105);
const win = new overBox(x + 17, 30, 190, 40, "YOU WIN!", 60);
const lose = new overBox(x + 17, 30, 190, 40, "YOU LOSE!", 60);
const leader = new overBox(x, 190, 225, 40, "Add to Leaderboard", 60);

// GAME OVER MESSAGE
const gameOver = {
  sX: 175,
  sY: 228,
  w: w,
  h: 165,
  x: x,
  y: 90,

  draw: function() {
    if (state.current == state.over) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );

      restart.draw("25px Teko");
      back.draw("25px Teko");
      if (players > 0 && robots > 0) {
        let count = 0;
        for (i = 0; i < robots; i++) {
          if (botList[i].death == false) {
            lose.draw("30px Teko");
            break;
          }
          count++;
        }
        if (count == robots) {
          win.draw("27px Teko");
        }
      }
      leader.draw("27px Teko");
    }
  }
};

//SCORE
const score = {
  value: 0,

  draw: function() {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    if (state.current == state.game) {
      ctx.font = "35px Teko";
      ctx.fillText(this.value, cvs.width / 2, 50);
      ctx.strokeText(this.value, cvs.width / 2, 50);
    }
    //SHOW END SCORE
    else if (state.current == state.over) {
      pipe.speed = 0;
      ctx.font = "25px Teko";
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);
      // BEST SCORE
      ctx.fillText(best, 225, 228);
      ctx.strokeText(best, 225, 228);
    }
    if (evo) {
      ctx.font = "35px Teko";
      ctx.fillText("BEST", 0, 25);
      ctx.strokeText("BEST", 0, 25);
      ctx.fillText(evoBest, 17, 60);
      ctx.strokeText(evoBest, 17, 60);
      ctx.fillText("GEN", cvs.width - 55, 25);
      ctx.strokeText("GEN", cvs.width - 55, 25);
      ctx.fillText(generation, cvs.width - 45, 60);
      ctx.strokeText(generation, cvs.width - 45, 60);
    }
  },

  update: function() {
    if (state.current == state.game) {
      this.value++;
      SCORE_S.play();
    }
    if (this.value > evoBest) {
      evoBest = this.value;
    }
  },

  reset: function() {
    this.value = 0;
  }
};

//DRAW
function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  if (state.current == state.menu) {
    menu.draw();
  } else if (state.current == state.difficult) {
    difficult.draw();
  } else {
    bg.draw();
    pipe.draw();
    fg.draw();

    for (var i = 0; i < birdList.length; i++) {
      birdList[i].draw();
    }
    for (var i = 0; i < botList.length; i++) {
      botList[i].draw();
    }
    if (state.current == state.over) {
      // console.log(state.current);
      gameOver.draw();
    }
    score.draw();
  }
}

//UPDATE
function update() {
  if (state.current == state.game || state.current == state.over) {
    for (var i = 0; i < birdList.length; i++) {
      birdList[i].update();
      // console.log(birdList[i]);
    }
    for (var i = 0; i < botList.length; i++) {
      if (
        botList[i].death == false &&
        state.current == state.over &&
        players > 0
      ) {
        botList[i].speed = 0;
        botList[i].gravity = 0;
      } else if (botList[i].death == false) {
        botList[i].think(pipe.position);
        FLAP.play();
        botList[i].score = botList[i].score + 1;
      }
      botList[i].update();
    }
    pipe.update();
    death();
    if (evo && state.current == state.over) {
      for (i = 0; i < birdList.length; i++) {
        birdList[i].reset();
        birdList[i].death = false;
      }
      let botDeaths = 0;
      for (var i = 0; i < botList.length; i++) {
        botList[i].reset();
        if (botList[i].death == true) {
          botList[i].death = false;
          botDeaths++;
        }
      }
      pipe.reset();
      state.current = state.game;
      if (evo) {
        nextGeneration();
      }
      for (var i = 0; i < botList.length; i++) {
        botList[i].score1();
      }
      score.reset();
      generation++;
    }
  }
}

//LOOP
function loopy() {
  update();
  draw();
  frames++;

  requestAnimationFrame(loopy);
}

loopy();
