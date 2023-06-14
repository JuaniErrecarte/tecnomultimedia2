class Columnas {
  constructor(x1, y1, ancho, alto, capa) {
    this.x1 = x1;
    this.y1 = y1;
    this.ancho = ancho;
    this.alto = alto;
    this.capa = capa;
  }

  mostrar() {
    this.capa.fill(70);
    this.capa.rect(this.x1, this.y1, this.ancho, this.alto);
  }

  mover() {
    this.alto += 10;
  }
}
