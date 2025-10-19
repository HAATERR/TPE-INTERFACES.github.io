let btn_play = document.getElementById('btn-jugar');
let btn_next = document.getElementById('next-level');
let pieces = [];
let img = new Image();
let ctx, pieceW, pieceH;
let level = 0;
let temp = document.getElementById('timer');
let INTERVAL = null; 

btn_play.addEventListener('click', () => {
  HTMLChange();
  getImage();
  timer_on();
});

btn_next.addEventListener('click', () => {
  level++; 
  getImage();
  timer_on();
});

function HTMLChange() {
  const game_div = document.querySelector(".juego");
  const game = document.querySelector(".juego-inicio");
  const blocka = document.querySelector('.blocka-game');
  const loading = document.querySelector(".loading");

  game_div.style.background = 'radial-gradient(at center , var(--BLACK_NEUTRAL) , var(--PRIMARY-SHADOW2))';
  game.style.display = 'none';

  loading.style.display = 'block';

  setTimeout(() => {
    loading.style.display = 'none';
    blocka.style.display = 'block';
  }, 1200);
}

function getImage() {
  const canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  const array_src = [
    'https://picsum.photos/600/600?random=1',
    'https://picsum.photos/600/600?random=2',
    'https://picsum.photos/600/600?random=3',
    'https://picsum.photos/600/600?random=4',
    'https://picsum.photos/600/600?random=5',
    'https://picsum.photos/600/600?random=6'
  ];

  img = new Image();
  img.src = array_src[random_image()];

  img.onload = () => {
    const rows = 2;
    const cols = 2;
    pieceW = canvas.width / cols;
    pieceH = canvas.height / rows;

    pieces = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        pieces.push({
          x,
          y,
          sx: x * (img.width / cols),
          sy: y * (img.height / rows),
          rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)]
        });
      }
    }

    drawPuzzle();

    if (level === 1) {
      greyFilter(ctx, canvas.width, canvas.height);
    }
  };
}

function random_image() {
  return Math.floor(Math.random() * 6);
}

function drawPuzzle() {
  const canvas = document.getElementById('canvas');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pieces.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);

    ctx.save();
    ctx.translate(col * pieceW + pieceW / 2, row * pieceH + pieceH / 2);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.drawImage(
      img,
      p.sx, p.sy, img.width / 2, img.height / 2,
      -pieceW / 2, -pieceH / 2, pieceW, pieceH
    );
    ctx.restore();

    ctx.strokeStyle = '#333';
    ctx.strokeRect(col * pieceW, row * pieceH, pieceW, pieceH);
  });
}

document.getElementById('canvas').addEventListener('contextmenu', e => e.preventDefault());

document.getElementById('canvas').addEventListener('mousedown', e => {
  if (!pieces.length) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = Math.floor(x / pieceW);
  const row = Math.floor(y / pieceH);
  const index = row * 2 + col;

  if (e.button === 0) {
    pieces[index].rotation -= 90;
  } else if (e.button === 2) {
    pieces[index].rotation += 90;
  }

  pieces[index].rotation = (pieces[index].rotation + 360) % 360;
  drawPuzzle();

  if (level >= 1) {
    greyFilter(ctx, canvas.width, canvas.height);
  }

  if (checkWin()) playerWon();
});

function checkWin() {
  return pieces.every(p => p.rotation % 360 === 0);
}

function playerWon() {
  temp.innerHTML = "🍻 Ganaste!";
  temp.style.color = "#0ea544";
  document.querySelector('.btn-gano').style.visibility = 'visible';
}

function timer_on() {
  // 🔹 Limpia interval anterior
  if (INTERVAL) clearInterval(INTERVAL);

  let tiempo = 60;
  temp.style.display = 'block';
  temp.classList.add('timer-show');

  INTERVAL = setInterval(() => {
    tiempo--;
    temp.innerHTML = `00:${tiempo < 10 ? '0' + tiempo : tiempo}`;

    if (checkWin()) {
      playerWon();
      clearInterval(INTERVAL);
      return;
    }

    if (tiempo <= 10) {
      temp.style.color = '#ce1234';
    }

    if (tiempo <= 0) {
      temp.innerHTML = "¡Perdiste!";
      temp.classList.remove('timer');
      temp.classList.add('game-lost');
      clearInterval(INTERVAL);
      return;
    }
  }, 1000);
}

function greyFilter(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    data[i] = data[i + 1] = data[i + 2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
}
