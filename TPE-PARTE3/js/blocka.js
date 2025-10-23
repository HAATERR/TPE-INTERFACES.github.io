'use strict'

document.addEventListener("DOMContentLoaded", () => {

    let btn_play = document.getElementById('btn-jugar');
    btn_play.addEventListener('click', () => {
        HTMLChange();
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
        'https://picsum.photos/800/800?random=8',
        'https://picsum.photos/800/800?random=9',
        'https://picsum.photos/800/800?random=10'
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
    let selectedSize = null;
    let tiempoInicial = 0;
    let tiempoTranscurrido = 0;
    let help_opened = false;
    let help = document.getElementById('btn-help')

    const levelConfig = [
        { maxTime: 90, filter: 'grayscale(100%)', name: 'Nivel 1 - Escala de Grises' },
        { maxTime: 85, filter: 'brightness(40%)', name: 'Nivel 2 - Brillo Bajo' },
        { maxTime: 80, filter: 'sepia(100%)', name: 'Nivel 3 - Sepia' },
        { maxTime: 75, filter: 'invert(100%)', name: 'Nivel 4 - Negativo' },
        { maxTime: 70, filter: 'hue-rotate(180deg)', name: 'Nivel 5 - Colores Invertidos' },
        { maxTime: 65, filter: 'contrast(50%) brightness(60%)', name: 'Nivel 6 - Contraste Bajo' }
    ];


    document.getElementById('btn-2x2').addEventListener('click', () => {
        selectedSize = { rows: 2, cols: 2 };
        currentLevel = 0;
        ayudaUsada = false;
        startLevel();
    });

    document.getElementById('btn-3x3').addEventListener('click', () => {
        selectedSize = { rows: 3, cols: 3 };
        currentLevel = 0;
        ayudaUsada = false;
        startLevel();
    });

    document.getElementById('btn-4x4').addEventListener('click', () => {
        selectedSize = { rows: 4, cols: 4 };
        currentLevel = 0;
        ayudaUsada = false;
        startLevel();
    });


    help.addEventListener('click', openHelp);

    function startLevel() {
        document.querySelector('.seleccion-tamano').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';

        help.style.display = 'flex';
        temp.style.color = '#FFFF';
        gameWon = false;

        btnPista.style.display = 'inline-block';
        if (btnAyuda) {
            btnAyuda.style.display = 'inline-block';
            btnAyuda.disabled = ayudaUsada;
            btnAyuda.style.opacity = ayudaUsada ? '0.5' : '1';
        }

        document.querySelector('.pista').style.display = 'flex';

        const btnNext = document.getElementById('btn-siguiente');
        const btnCambiar = document.getElementById('btn-cambiar-tamano');
        if (btnNext) btnNext.style.display = 'inline-block';
        if (btnCambiar) btnCambiar.style.display = 'none';

        getImage();
    }

    function getImage() {
        const canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = 450;
        canvas.height = 400;


        const randomIndex = Math.floor(Math.random() * array_src.length);
        img = new Image();
        img.src = array_src[randomIndex];

        img.onload = () => {

            const config = levelConfig[currentLevel];

            currentRows = selectedSize.rows;
            currentCols = selectedSize.cols;

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

            let tiempoAjustado = config.maxTime;
            if (currentRows === 3 && currentCols === 3) {
                tiempoAjustado = config.maxTime + 30;
            } else if (currentRows === 4 && currentCols === 4) {
                tiempoAjustado = config.maxTime + 60;
            }

            tiempoInicial = tiempoAjustado;
            timer_on(tiempoAjustado);
        };
    }

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

            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(col * pieceW, row * pieceH, pieceW, pieceH);
        });

        ctx.filter = 'none';
    }


    document.getElementById('canvas').addEventListener('contextmenu', e => e.preventDefault());


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
                pieces[index].rotation -= 90;
            } else if (e.button === 2) {
                pieces[index].rotation += 90;
            }

            pieces[index].rotation = (pieces[index].rotation + 360) % 360;
            drawPuzzle();

            setTimeout(() => {
                if (checkWin()) playerWon();
            }, 80);
        }
    });

    function checkWin() {
        return pieces.every(p => ((p.rotation % 360 + 360) % 360) === 0);
    }

    function playerWon() {
        clearInterval(timerInterval);
        gameWon = true;
        btnPista.style.display = 'none';
        if (btnAyuda) btnAyuda.style.display = 'none';

        tiempoTranscurrido = tiempoInicial - tiempo;
        const minutos = Math.floor(tiempoTranscurrido / 60);
        const segundos = tiempoTranscurrido % 60;

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

        const btnNext = document.getElementById('btn-siguiente');
        const btnCambiar = document.getElementById('btn-cambiar-tamano');
        const btnGano = document.querySelector('.btn-gano');
        const btnMenu = document.querySelector('.btn-menu');

        if (currentLevel < totalLevels - 1) {
            temp.innerHTML = `¡Nivel ${currentLevel + 1} completado en ${minutos}:${segundos < 10 ? '0' + segundos : segundos}!`;
            temp.style.color = "#08a03d";

            if (btnGano) btnGano.style.display = 'flex';
            if (btnNext) {
                btnNext.style.display = 'inline-block';
                btnNext.onclick = () => {
                    currentLevel++;
                    btnGano.style.display = 'none';
                    if (btnMenu) btnMenu.style.display = 'none';
                    ayudaUsada = false;
                    startLevel();
                };
            }
            if (btnCambiar) btnCambiar.style.display = 'none';
        } else {
            temp.innerHTML = `¡Completaste todos los niveles!`;
            temp.style.color = "#08a03d";

            if (btnGano) btnGano.style.display = 'flex';
            if (btnNext) btnNext.style.display = 'none';
            if (btnCambiar) btnCambiar.style.display = 'inline-block';
        }

        if (btnMenu) btnMenu.style.display = 'flex';
    }

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


    function HTMLChange() {
        const game_div = document.querySelector(".juego");
        const game = document.querySelector(".juego-inicio");
        const blocka = document.querySelector('.blocka-game');
        const loading = document.querySelector(".loading");
        const seleccion = document.querySelector(".seleccion-tamano");

        if (!game_div || !game || !blocka || !loading || !seleccion) return;

        game_div.style.backgroundImage = 'none';
        game_div.style.background = 'radial-gradient(at center , var(--BLACK_NEUTRAL) , var(--PRIMARY-SHADOW2))';
        game.style.display = 'none';

        loading.style.display = 'flex';
        loading.style.background = 'radial-gradient(at center , var(--BLACK_NEUTRAL) , var(--PRIMARY-SHADOW2))';

        setTimeout(() => {
            loading.style.display = 'none';
            seleccion.style.display = 'flex';
            btnAyuda.style.display = 'none';
            btnPista.style.display = 'none';
            help.style.display = 'none';
        }, 1200);
    }


    btnPista.addEventListener('click', () => {
        if (gameWon) return;

        const pistaActiva = true;
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

        const tiempoAnterior = tiempo;
        temp.innerHTML = "Vista previa...";
        temp.style.color = "#FF8329";

        setTimeout(() => {
            if (!gameWon && pistaActiva) {
                drawPuzzle();
                tiempo = tiempoAnterior;

                const minutos = Math.floor(tiempo / 60);
                const segundos = tiempo % 60;
                temp.innerHTML = `${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
                temp.style.color = tiempo <= 10 ? '#ce1234' : '#FFFF';
            }
        }, 3000);
    });

    if (btnAyuda) {
        btnAyuda.addEventListener('click', () => {
            if (ayudaUsada || gameWon) return;

            const piezasIncorrectas = pieces.filter(p => p.rotation !== 0);

            if (piezasIncorrectas.length > 0) {
                const randomPieza = piezasIncorrectas[Math.floor(Math.random() * piezasIncorrectas.length)];
                randomPieza.rotation = 0;

                drawPuzzle();

                tiempo += 5;

                ayudaUsada = true;
                btnAyuda.disabled = true;
                btnAyuda.style.opacity = '0.5';

                const tiempoAnterior = tiempo;
                temp.innerHTML = "Ayuda aplicada (+5s)";
                temp.style.color = "#FF8329";

                setTimeout(() => {
                    if (!gameWon) {
                        const minutos = Math.floor(tiempo / 60);
                        const segundos = tiempo % 60;
                        temp.innerHTML = `${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
                        temp.style.color = tiempo <= 10 ? '#ce1234' : '#ffff';
                    }
                }, 2000);
            }
        });
    }

    const btnReintentar = document.getElementById('btn-reintentar');
    if (btnReintentar) {
        btnReintentar.addEventListener('click', () => {
            document.querySelector('.btn-perdio').style.display = 'none';
            document.getElementById('canvas').style.display = 'block';
            startLevel();
        });
    }

    const btnCambiarTamano = document.getElementById('btn-cambiar-tamano');
    if (btnCambiarTamano) {
        btnCambiarTamano.addEventListener('click', () => {
            clearInterval(timerInterval);
            gameWon = false;

            document.querySelector('.btn-gano').style.display = 'none';
            document.querySelector('.btn-menu').style.display = 'none';
            document.getElementById('canvas').style.display = 'none';
            document.querySelector('.pista').style.display = 'none';
            temp.style.display = 'none';

            document.querySelector('.seleccion-tamano').style.display = 'flex';
        });
    }

    function openHelp() {
        let help_text = document.getElementById('text-help');

        if (!help_opened) {
            help_text.style.display = 'flex';
            help_opened = true;
        }
        else {
            help_text.style.display = 'none';
            help_opened = false;
        }
    }

});



