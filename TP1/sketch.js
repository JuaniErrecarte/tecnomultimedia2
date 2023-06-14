let amplitudMinima = 0.08; //esto l ohago porque aunque no haya sonidoi la amplitud se mueve
let amplitudMaxima = 0.9;
let haySonido = false; //esto sirve para quie a partir de cierto nivel de amplitud empiece a dibujar, entonces cada vez que haya sonido se va a ejectutar nuestras funciones
let microfono, amplitud;
let IMPRIMIR = true;
let columnas = [];
let capaPinceladas, capaColumnas;
const pinceladas = [];
let cantidad = 7;
let tiempo = 0;
let espacioColumn = 100;
let modeloAplausos =
  "https://teachablemachine.withgoogle.com/models/naa8C2egQ/";
const pichModel =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";
let pinceladaBlanca1, pinceladaBlanca2;
let label; //chequea si es aplauso o ruido de fondo
let deberiaDibujar = true;
//GESTOR
let gestorAmp;
let frecuencia;
let freMin = 880;
let frecMax = 2000;
let audioContext;
let posicionYcuadradoBlanco;
function preload() {
  clasificadorDeAplausos = ml5.soundClassifier(modeloAplausos + "model.json");

  for (let i = 0; i < cantidad; i++) {
    let nombre = "data/pinceladas" + nf(i, 2) + ".png";
    pinceladas[i] = loadImage(nombre);
    console.log("agregada pincelada: " + nombre);
  }
}

function setup() {
  audioContext = getAudioContext();

  clasificadorDeAplausos.classify(clasificadorCallback);
  microfono = new p5.AudioIn();
  microfono.start();
  microfono.start(startPitch);
  userStartAudio();
  amplitud = new p5.Amplitude();
  gestorAmp = new GestorSenial(amplitudMinima, amplitudMaxima);
  canvas = createCanvas(windowWidth, windowHeight);
  capaColumnas = createGraphics(windowWidth, windowHeight);
  capaPinceladas = createGraphics(windowWidth, windowHeight);

  for (let i = 0; i < 12; i++) {
    const ANCHO_COLUMNA = windowWidth / 12 - espacioColumn + 8;
    let xColumna = (ANCHO_COLUMNA + espacioColumn) * i; // Espacio horizontal entre las columnas
    let columna = new Columnas(xColumna, 0, ANCHO_COLUMNA, 50, capaColumnas); // Crear un objeto columna en la posición x
    columnas.push(columna); // Agregar el objeto columna al array
  }
}

function draw() {
  background(255, 255, 255, 200);

  if (label == "Class 2" && deberiaDibujar) {
    const indexPincelada = parseInt(random(5, 6));
    const pincelada = pinceladas[indexPincelada];
    image(pincelada, random(0, windowWidth), posicionYcuadradoBlanco);
    deberiaDibujar = false;
    posicionYcuadradoBlanco = height;
    if (frecuencia >= frecMax / 2) {
      posicionYcuadradoBlanco--;
    } else {
      posicionYcuadradoBlanco++;
      // } else if(posicionYcuadradoBlanco >=height){
      //   posicionYcuadradoBlanco==height;
    }
  }
  gestorAmp.actualizar(microfono.getLevel());
  tiempo++;
  amplitud = gestorAmp.filtrada;
  haySonido = amplitud > amplitudMinima; //condicion de que si amplitud es mayor que la amplitud minima establecida x nosotros, hay sonido es true, nos va a servir para a partir de su valor q se ejecuten las cosas que querrramos

  if (haySonido == true) {
    let cual = capaPinceladas.int(random(0, 4));

    let x = map(
      amplitud,
      amplitudMinima,
      amplitudMaxima,
      espacioColumn,
      width - espacioColumn
    );
    let y = map(
      amplitud,
      amplitudMinima,
      amplitudMaxima,
      espacioColumn,
      height - espacioColumn
    );

    // Ajustar la posición x e y según el espacio entre las columnas
    x = round(x / espacioColumn) * espacioColumn;
    y = round(y / espacioColumn) * espacioColumn;
    capaPinceladas.tint(255, 150);
    capaPinceladas.image(pinceladas[cual], x, y, 300, 300);
    console.log(capaPinceladas[cual]);
    background(255, 255, 255, 50);
  }
  image(capaColumnas, 0, 0);
  image(capaPinceladas, 0, 0);

  for (let i = 0; i < columnas.length; i++) {
    let columna = columnas[i];
    columna.mostrar();
    columna.mover();
  }

  // if (mouseMoved && tiempo % 15 === 0) {
  //   // Controlar la velocidad de aparición de las imágenes (cada 30 frames)
  //   let cual = capa2.int(random(cantidad)); //muevo con el mouse las pinceladas
  //   let x = map(mouseX, 0, width, espacioColumn, width - espacioColumn);
  //   let y = map(mouseY, 0, height, espacioColumn, height - espacioColumn);

  //   // Ajustar la posición x y y según el espacio entre las columnas
  //   x = round(x / espacioColumn) * espacioColumn;
  //   y = round(y / espacioColumn) * espacioColumn;
  //   capa2.tint(255, 150);
  //   capa2.image(pincelada[cual], x, y, 300, 300);
  // }

  // Reiniciar el tiempo después de un tiempo determinado para evitar que se vuelva demasiado grande

  // if (IMPRIMIR) {
  //   printData();
  // }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function clasificadorCallback(error, results) {
  if (error) {
    console.error(error);
  }
  label = results[0].label;
}
function startPitch() {
  pitch = ml5.pitchDetection(pichModel, audioContext, mic.stream, modelLoaded);
}
function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      frecuencia = frequency;
    } else {
    }
    getPitch();
  });
}
