class menuBox {
  constructor(x, y, w, h, name, offset) {
    this.x = x;
    this.y = cvs.height * (y + offset);
    this.w = w;
    this.h = h;
    this.name = name;
  }

  draw(font) {
    ctx.fillStyle = "#dd7746";
    //BUTTON
    ctx.fillRect(this.x, this.y, this.w, this.h);

    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.font = font;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(this.name, this.x + this.w / 2, this.y + this.h / 2);
    ctx.strokeText(this.name, this.x + this.w / 2, this.y + this.h / 2);
  }
}

class overBox extends menuBox {
  constructor(x, y, w, h, name, offset) {
    super(x, y, w, h, name);
    this.y = y + offset;
  }
  draw(font) {
    ctx.fillStyle = "#dd7746";
    //BUTTON
    ctx.fillRect(this.x, this.y, this.w, this.h);

    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.font = font;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(this.name, this.x + this.w / 2, this.y + this.h / 2);
    ctx.strokeText(this.name, this.x + this.w / 2, this.y + this.h / 2);
  }
}
