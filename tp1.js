//Errecarte Juan Ignacio Agustin Herrera, Ignacio Coste, Alexis

class Columnas {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  mostrar() {
    rect(this.x1, this.y1, this.x2, this.y2);
  }

  mover() {
    this.y2 += 10;
  }
}

let columna = new Columnas(0, 10, 50, 50);
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(200);
  frameRate(30);
}

function draw() {
  columna.mostrar();
  columna.mover();
}
