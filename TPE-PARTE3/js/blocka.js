let btn_play = document.getElementById('btn-jugar');
btn_play.addEventListener('click', () => {
  HTMLChange();
  startLevel();
});

let currentLevel = 0;
const totalLevels = 6;
const array_src = [
  'https://picsum.photos/800/800?random=1',
  'https://picsum.photos/800/800?random=2',
  'https://picsum.photos/800/800?random=3',
  'https://picsum.photos/800/800?random=4',
  'https://picsum.photos/800/800?random=5',
  'https://picsum.photos/800/800?random=6',
  'https://picsum.photos/800/800?random=7',
  'https://picsum.photos/800/800?random=8'
];

let pieces = [];
let img = new Image();
let ctx, pieceW, pieceH;
let temp = document.getElementById('timer');
let timerInterval;
let gameWon = false;
let ayudaUsada = false;
let btnPista = document.getElementById('btn-pista');
let btnAyuda = document.getElementById('btn-ayuda');
let tiempo = 0;
let currentRows = 2;
let currentCols = 2;

// Configuración de dificultad por nivel
const levelConfig = [
  { rows: 2, cols: 2, maxTime: 90, filter: 'grayscale(100%)', name: 'Nivel 1 - Escala de Grises' },
  { rows: 2, cols: 2, maxTime: 80, filter: 'brightness(30%)', name: 'Nivel 2 - Brillo Bajo' },
  { rows: 2, cols: 2, maxTime: 70, filter: 'invert(100%)', name: 'Nivel 3 - Negativo' },
  { rows: 2, cols: 3, maxTime: 100, filter: 'grayscale(100%)', name: 'Nivel 4 - Escala de Grises' },
  { rows: 2, cols: 3, maxTime: 90, filter: 'brightness(30%)', name: 'Nivel 5 - Brillo Bajo' },
  { rows: 3, cols: 3, maxTime: 120, filter: 'invert(100%)', name: 'Nivel 6 - Negativo' }
];

// ------------------ INICIO DE NIVEL ------------------
function startLevel() {
  temp.style.color = '#000';
  gameWon = false;
  ayudaUsada = false;
  
  // Mostrar botones
  btnPista.style.display = 'inline-block';
  if (btnAyuda) {
    btnAyuda.style.display = 'inline-block';
    btnAyuda.disabled = false;
    btnAyuda.style.opacity = '1';
  }
  
  getImage();
}

// ------------------ CARGAR IMAGEN ------------------
function getImage() {
  const canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 450;
  canvas.height = 400;

  // Elegir imagen aleatoria
  const randomIndex = Math.floor(Math.random() * array_src.length);
  img = new Image();
  img.src = array_src[randomIndex];
  
  img.onload = () => {
    const config = levelConfig[currentLevel];
    currentRows = config.rows;
    currentCols = config.cols;
    
    pieceW = canvas.width / currentCols;
    pieceH = canvas.height / currentRows;
    pieces = [];

    for (let y = 0; y < currentRows; y++) {
      for (let x = 0; x < currentCols; x++) {
        pieces.push({
          x,
          y,
          sx: x * (img.width / currentCols),
          sy: y * (img.height / currentRows),
          rotation: [90, 180, 270][Math.floor(Math.random() * 3)],
          filter: config.filter
        });
      }
    }

    drawPuzzle();
    timer_on(config.maxTime);
  };
}

// ------------------ DIBUJAR PUZZLE ------------------
function drawPuzzle() {
  const canvas = document.getElementById('canvas');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pieces.forEach((p, i) => {
    const col = i % currentCols;
    const row = Math.floor(i / currentCols);

    ctx.save();
    ctx.beginPath();
    ctx.rect(col * pieceW, row * pieceH, pieceW, pieceH);
    ctx.clip();

    ctx.translate(col * pieceW + pieceW / 2, row * pieceH + pieceH / 2);
    ctx.rotate((p.rotation * Math.PI) / 180);

    // Aplicar filtro solo si la pieza no está correcta
    ctx.filter = p.rotation !== 0 ? p.filter : 'none';
    
    ctx.drawImage(
      img,
      p.sx,
      p.sy,
      img.width / currentCols,
      img.height / currentRows,
      -pieceW / 2,
      -pieceH / 2,
      pieceW,
      pieceH
    );
    ctx.restore();

    // Borde de pieza
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(col * pieceW, row * pieceH, pieceW, pieceH);
  });

  ctx.filter = 'none';
}

// ------------------ EVITAR MENÚ CLIC DERECHO ------------------
document.getElementById('canvas').addEventListener('contextmenu', e => e.preventDefault());

// ------------------ ROTACIÓN PIEZAS ------------------
document.getElementById('canvas').addEventListener('mousedown', e => {
  if (!pieces.length || gameWon) return;

  const canvas = document.getElementById('canvas');
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const canvasX = x * scaleX;
  const canvasY = y * scaleY;
  
  const col = Math.floor(canvasX / pieceW);
  const row = Math.floor(canvasY / pieceH);
  const index = row * currentCols + col;

  if (index >= 0 && index < pieces.length) {
    if (e.button === 0) {
      // Click izquierdo: gira a la izquierda
      pieces[index].rotation -= 90;
    } else if (e.button === 2) {
      // Click derecho: gira a la derecha
      pieces[index].rotation += 90;
    }

    pieces[index].rotation = (pieces[index].rotation + 360) % 360;
    drawPuzzle();

    setTimeout(() => {
      if (checkWin()) playerWon();
    }, 80);
  }
});

// ------------------ COMPROBAR SI GANÓ ------------------
function checkWin() {
  return pieces.every(p => ((p.rotation % 360 + 360) % 360) === 0);
}

// ------------------ GANAR ------------------
function playerWon() {
  clearInterval(timerInterval);
  gameWon = true;
  btnPista.style.display = 'none';
  if (btnAyuda) btnAyuda.style.display = 'none';

  // Redibujar imagen completa sin filtros
  const canvas = document.getElementById('canvas');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = 'none';
  
  for (let y = 0; y < currentRows; y++) {
    for (let x = 0; x < currentCols; x++) {
      ctx.drawImage(
        img,
        x * (img.width / currentCols),
        y * (img.height / currentRows),
        img.width / currentCols,
        img.height / currentRows,
        x * pieceW,
        y * pieceH,
        pieceW,
        pieceH
      );
    }
  }
  
  // Mostrar mensaje de victoria
  if (currentLevel < totalLevels - 1) {
    temp.innerHTML = `¡Ganaste!`;
    temp.style.color = "#08a03d";

    const btnNext = document.getElementById('btn-siguiente');
    if (btnNext) {
      document.querySelector('.btn-gano').style.display = 'flex';
      btnNext.onclick = () => {
        currentLevel++;
        document.querySelector('.btn-gano').style.display = 'none';
        startLevel();
      };
    }
  } else {
    temp.innerHTML = "¡Ganaste todos los niveles!";
    temp.style.color = "#08a03d";
    document.querySelector('.btn-gano').style.display = 'none';
  }

  const btnMenu = document.querySelector('.btn-menu');
  if (btnMenu) btnMenu.style.display = 'flex';
}

// ------------------ PERDER ------------------
function playerLost() {
  temp.innerHTML = "¡Se acabó el tiempo!";
  temp.style.color = "#ce1234";
  gameWon = true;
  
  btnPista.style.display = 'none';
  if (btnAyuda) btnAyuda.style.display = 'none';
  
  document.querySelector('.btn-perdio').style.display = 'flex';

  const btnMenu = document.querySelector('.btn-menu');
  if (btnMenu) btnMenu.style.display = 'flex';

  clearInterval(timerInterval);
}

// ------------------ TIMER ------------------
function timer_on(maxTime) {
  tiempo = maxTime;
  temp.style.display = 'block';
  temp.classList.add('timer-show');

  timerInterval = setInterval(() => {
    if (gameWon) {
      clearInterval(timerInterval);
      return;
    }

    tiempo--;
    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;
    temp.innerHTML = `${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;

    if (checkWin()) {
      playerWon();
      return;
    }

    if (tiempo <= 10) temp.style.color = '#ce1234';
    if (tiempo <= 0) playerLost();
  }, 1000);
}

// ------------------ CAMBIO DE HTML ------------------
function HTMLChange() {
  const game_div = document.querySelector(".juego");
  const game = document.querySelector(".juego-inicio");
  const blocka = document.querySelector('.blocka-game');
  const loading = document.querySelector(".loading");

  game.style.display = 'none';
  loading.style.display = 'block';

  setTimeout(() => {
    loading.style.display = 'none';
    blocka.style.display = 'block';
  }, 1200);
}

// ------------------ BOTÓN DE PISTA ------------------
btnPista.addEventListener('click', () => {
  if (gameWon) return;
  
  // Guardar estado actual
  const pistaActiva = true;
  
  // Mostrar imagen original por 3 segundos
  const canvas = document.getElementById('canvas');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = 'none';
  
  for (let y = 0; y < currentRows; y++) {
    for (let x = 0; x < currentCols; x++) {
      ctx.drawImage(
        img,
        x * (img.width / currentCols),
        y * (img.height / currentRows),
        img.width / currentCols,
        img.height / currentRows,
        x * pieceW,
        y * pieceH,
        pieceW,
        pieceH
      );
    }
  }
  
  // Mostrar texto de pista temporalmente
  const tiempoAnterior = tiempo;
  temp.innerHTML = "Vista previa...";
  temp.style.color = "#FF8329";
  
  setTimeout(() => {
    if (!gameWon && pistaActiva) {
      drawPuzzle();
      tiempo = tiempoAnterior;
      
      // Restaurar timer
      const minutos = Math.floor(tiempo / 60);
      const segundos = tiempo % 60;
      temp.innerHTML = `${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
      temp.style.color = tiempo <= 10 ? '#ce1234' : '#000';
    }
  }, 3000);
});

// ------------------ BOTÓN DE AYUDITA ------------------
if (btnAyuda) {
  btnAyuda.addEventListener('click', () => {
    if (ayudaUsada || gameWon) return;
    
    // Rotar correctamente una pieza aleatoria que no esté bien
    const piezasIncorrectas = pieces.filter(p => p.rotation !== 0);
    
    if (piezasIncorrectas.length > 0) {
      const randomPieza = piezasIncorrectas[Math.floor(Math.random() * piezasIncorrectas.length)];
      randomPieza.rotation = 0;
      
      drawPuzzle();
      
      // Sumar 5 segundos de penalización
      tiempo += 5;
      
      ayudaUsada = true;
      btnAyuda.disabled = true;
      btnAyuda.style.opacity = '0.5';
      
      // Mostrar mensaje temporal
      const tiempoAnterior = tiempo;
      temp.innerHTML = "Ayuda aplicada (+5s)";
      temp.style.color = "#FF8329";
      
      setTimeout(() => {
        if (!gameWon) {
          const minutos = Math.floor(tiempo / 60);
          const segundos = tiempo % 60;
          temp.innerHTML = `${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
          temp.style.color = tiempo <= 10 ? '#ce1234' : '#000';
        }
      }, 2000);
    }
  });
}

// ------------------ BOTÓN REINTENTAR ------------------
const btnReintentar = document.getElementById('btn-reintentar');
if (btnReintentar) {
  btnReintentar.addEventListener('click', () => {
    document.querySelector('.btn-perdio').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    startLevel();
  });}
