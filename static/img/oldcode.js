BIRD

const bird = {
  animation: [
    { sX: 276, sY: 112 },
    { sX: 276, sY: 139 },
    { sX: 276, sY: 164 },
    { sX: 276, sY: 139 }
  ],
  x: cvs.width / 2,
  y: cvs.height / 2,
  w: w,
  h: 26,
  radius: w/2,

  frame: 0,

  //BIRD JUMPING SPEEDS
  gravity: 0.5,
  speed: 0,
  jump: 7,

  draw: function() {
    let bird = this.animation[this.frame];
    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      this.x - this.w / 2,
      this.y - this.h / 2,
      this.w,
      this.h
    );
  },

  flap: function() {
    this.speed = -this.jump;
  },

  update: function() {
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

    //BIRD HITS GROUND
    if (this.y + bird.radius >= fg.y) {
      this.y = fg.y - this.h / 2;
      pipe.speed = 0;
      state.current = state.over;
    }
  },

  reset: function() {
    this.x = cvs.width / 2;
    this.y = cvs.height / 2;
    this.speed = 0;
    this.gravity = 0.5;
  }
};

const menu = {
    h: cvs.height*.25,
    offSet: .275,
    y:.1,

    draw: function(){
          ctx.fillStyle = "#70c5ce";
          ctx.fillRect(0, 0, cvs.width, cvs.height);

          ctx.fillStyle = "#dd7746";
          //1PLAYER BUTTON
          ctx.fillRect(0, cvs.height*this.y, cvs.width, this.h);
          //LOCAL PLAYER BUTTON
          ctx.fillRect(0, cvs.height*(this.y+this.offSet), cvs.width, this.h);
          //ONLINE PLAYER BUTTON
          ctx.fillRect(0, cvs.height*(this.y+(2*this.offSet)), cvs.width, this.h);

          ctx.fillStyle = "#FFF";
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 2;
          ctx.font = "35px Teko";

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.fillText("1-Player", cvs.width/2, cvs.height * this.y + this.h/2);
          ctx.strokeText("1-Player", cvs.width/2, cvs.height * this.y + this.h/2);

          ctx.fillText("Local Multiplayer", cvs.width/2, cvs.height * (this.y+this.offSet) + this.h/2);
          ctx.strokeText("Local Multiplayer", cvs.width/2, cvs.height * (this.y+this.offSet)+ this.h/2);

          ctx.fillText("Online Multiplayer", cvs.width/2, cvs.height * (this.y+ 2*this.offSet)+ this.h/2);
          ctx.strokeText("Online Multiplayer", cvs.width/2, cvs.height * (this.y+ 2*this.offSet) + this.h/2);

    }
};

var w = 225;
// GAME OVER MESSAGE
const gameOver = {
  sX: 175,
  sY: 228,
  w: w,
  h: 165,
  x: cvs.width / 2 - w / 2,
  y: 90,
  boxX: (cvs.width / 2) - (w / 2)+ 15,
  boxW: 95,
  boxH: 35,
  box1YOffset: 60,
  box2YOffset: 105,

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

      //DRAW CUSTOM BOXES
      ctx.fillStyle = "#dd7746";
      ctx.fillRect(this.boxX, this.y + this.box1YOffset, this.boxW, this.boxH);
      ctx.fillRect(this.boxX, this.y + this.box2YOffset, this.boxW, this.boxH);


      //ADD TEXT TO BOXES
      ctx.fillStyle = "#FFF";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.font = "25px Teko";

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText("RESTART", this.boxX + this.boxW/2, this.y + this.box1YOffset + this.boxH/2);
      ctx.strokeText("RESTART", this.boxX + this.boxW/2, this.y +  this.box1YOffset + this.boxH/2);

      ctx.fillText("MENU", this.boxX + this.boxW/2, this.y +  this.box2YOffset + this.boxH/2);
      ctx.strokeText("MENU", this.boxX + this.boxW/2, this.y +  this.box2YOffset + this.boxH/2);
    }
  }
};