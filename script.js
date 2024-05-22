document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', control);

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => cells[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }
    
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => cells[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }
    
    function rotate() {
        undraw();
        currentRotation = (currentRotation + 1) % current.length;
        current = tetrominoes[random][currentRotation];
        draw();
    }
    
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
    
    function control(e) {
        if (e.keyCode === 37) {  // 左矢印キー
            moveLeft();
        } else if (e.keyCode === 38) {  // 上矢印キー
            rotate();
        } else if (e.keyCode === 39) {  // 右矢印キー
            moveRight();
        } else if (e.keyCode === 40) {  // 下矢印キー
            moveDown();
        }
    }
    
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 10;
    let cells = [];
    let score = 0;
    let timerId;
    let currentPosition = 4;
    let currentRotation = 0;

    // Create the grid cells
    for (let i = 0; i < 200; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
        cells.push(cell);
    }

    // Add "taken" cells at the bottom
    for (let i = 0; i < 10; i++) {
        const cell = document.createElement('div');
        cell.classList.add('taken');
        grid.appendChild(cell);
        cells.push(cell);
    }

    // The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const tetrominoes = [lTetromino]; // 他のテトリミノもここに追加します

    let random = Math.floor(Math.random() * tetrominoes.length);
    let current = tetrominoes[random][currentRotation];

    function draw() {
        current.forEach(index => {
            cells[currentPosition + index].classList.add('tetromino');
        });
    }

    function undraw() {
        current.forEach(index => {
            cells[currentPosition + index].classList.remove('tetromino');
        });
    }

    timerId = setInterval(moveDown, 1000);

    function freeze() {
        if (current.some(index => cells[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => cells[currentPosition + index].classList.add('taken'));
            random = Math.floor(Math.random() * tetrominoes.length);
            current = tetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            addScore();
            gameOver();
        }
    }

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(index => cells[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    cells[index].classList.remove('taken');
                    cells[index].classList.remove('tetromino');
                });
                const cellsRemoved = cells.splice(i, width);
                cells = cellsRemoved.concat(cells);
                cells.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if (current.some(index => cells[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'ゲームオーバー';
            clearInterval(timerId);
        }
    }

    draw();
});
