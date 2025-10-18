
let btn_play = document.getElementById('btn-jugar');
btn_play.addEventListener('click', () => {
    HTMLChange();
    timer_on();
});



function random_image() {
    return Math.floor(Math.random() * 6); // devuelve 0 a 5
}

document.getElementById('btn-jugar').addEventListener('click', getImage);

let pieces = [];
let img = new Image();
let ctx, pieceW, pieceH;

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

        // Crear piezas (rotadas aleatoriamente)
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
    };
}

// Evita menú del clic derecho
document.getElementById('canvas').addEventListener('contextmenu', e => e.preventDefault());

// Maneja rotación con clics
document.getElementById('canvas').addEventListener('mousedown', e => {
    if (!pieces.length) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / pieceW);
    const row = Math.floor(y / pieceH);
    const index = row * 2 + col;

    if (e.button === 0) {
        pieces[index].rotation -= 90; // clic izquierdo
    } else if (e.button === 2) {
        pieces[index].rotation += 90; // clic derecho
    }

    pieces[index].rotation = (pieces[index].rotation + 360) % 360;
    drawPuzzle();
    checkWin();
});

function drawPuzzle() {
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

function checkWin() {
    const allCorrect = pieces.every(p => p.rotation % 360 === 0);
    return allCorrect;
}

function playerWon() {
    temp.innerHTML = "🍻 Ganaste!";
    temp.style.color = "#0ea544";
    let btn_gano = document.querySelector('btn-gano');
    btn_gano.style.display = 'flex';

}

// ------------------ TIMER ------------------


let temp = document.getElementById('timer');

function timer_on() {
    let tiempo = 60;

    temp.style.display = 'block';
    temp.classList.add('timer-show');

    const INTERVAL = setInterval(() => {
        tiempo--;
        temp.innerHTML = `00:${tiempo}`;

        if (tiempo <= 58) {
            if (checkWin()) {
                playerWon();
                clearInterval(INTERVAL);
                return;
            }
        }

        if (tiempo == 10) {
            temp.innerHTML = `00:${tiempo}`
            temp.style.color = '#ce1234';
        }

        if (tiempo <= 10) {
            temp.innerHTML = `00:0${tiempo}`
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


function HTMLChange() {
    const game_div = document.querySelector(".juego");
    const game = document.querySelector(".juego-inicio");
    const blocka = document.querySelector('.blocka-game');
    const loading = document.querySelector(".loading");

    game_div.style.backgroundImage = 'none';
    game.style.display = 'none';

    loading.style.display = 'block';

    setTimeout(() => {
        loading.style.display = 'none';
        blocka.style.display = 'block';
    }, 1200);
}
