const screenGame = document.getElementById('screen-game');
const screenCountdown = document.getElementById('screen-countdown');
const countdownMessage = document.getElementById('countdown-message');
const countdownTimer = document.getElementById('countdown-timer');
const countdownPlayer = document.getElementById('countdown-player');

const buttonResetZen = document.getElementById('button-reset-zen');

const board = document.getElementById('board');
const turnTimer = document.getElementById('turn-timer');
const turnIndicator = document.getElementById('turn-indicator');
const player1Info = document.getElementById('player1-info');
const player2Info = document.getElementById('player2-info');
const player1Progress = document.getElementById('player1-progress');
const player2Progress = document.getElementById('player2-progress');
const player1Name = document.getElementById('player1-name');
const player2Name = document.getElementById('player2-name');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');

let players = [
    { name: '', color: '', symbol: 'X', score: 0 },
    { name: '', color: '', symbol: 'O', score: 0 }
];

let gameMode = 'zen';
let isGameActive = false;

let currentPlayerIndex = 0;
let gameBoard = ['', '', '', '', '', '', '', '', ''];


document.addEventListener('keydown', (event) => {
    if (!isGameActive) return;

    const keyBindingsPlayer1 = {
        'q': 0, 'w': 1, 'e': 2,
        'a': 3, 's': 4, 'd': 5,
        'z': 6, 'x': 7, 'c': 8
    };

    const keyBindingsPlayer2 = {
        'i': 0, 'o': 1, 'p': 2,
        'k': 3, 'l': 4, ';': 5,
        ',': 6, '.': 7, '/': 8
    };

    if (currentPlayerIndex === 0 && keyBindingsPlayer1.hasOwnProperty(event.key)) {
        const cellIndex = keyBindingsPlayer1[event.key];
        if (gameMode === 'zen') {
            zenClick(cellIndex);
        } else if (gameMode === 'battle') {
            battleClick(cellIndex);
        }
    } else if (currentPlayerIndex === 1 && keyBindingsPlayer2.hasOwnProperty(event.key)) {
        const cellIndex = keyBindingsPlayer2[event.key];
        if (gameMode === 'zen') {
            zenClick(cellIndex);
        } else if (gameMode === 'battle') {
            battleClick(cellIndex);
        }
    }
});

function showCountdown() {
    currentPlayerIndex = Math.floor(Math.random() * 2);
    countdownMessage.textContent = `match starts in`;
    countdownPlayer.textContent = `${players[currentPlayerIndex].name} goes first`;
    countdownTimer.textContent = '5';
    screenCountdown.classList.remove('hidden');
    screenCountdown.classList.add('fade-in');

    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown -= 1;
        if (countdown > 0) {
            countdownTimer.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            screenCountdown.classList.add('fade-out');
            setTimeout(() => {
                screenCountdown.classList.add('hidden');
                screenCountdown.classList.remove('fade-out');
                screenGame.classList.remove('hidden');
                screenGame.classList.add('fade-in');
                if (gameMode === 'battle') {
                    startRound();
                } else {
                    createBoard();
                    turnIndicator.textContent = `${players[currentPlayerIndex].name}'s Turn`;
                    isGameActive = true;
                }
            }, 500);
        }
    }, 1000);
}

function createBoard() {
    board.innerHTML = '';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('board-cell');
        if (gameMode === 'zen') {
            cellElement.addEventListener('click', () => zenClick(index));
        } else {
            cellElement.addEventListener('click', () => battleClick(index));
        }
        board.appendChild(cellElement);
    });

    if (gameMode === 'zen') {
        turnTimer.classList.add('hidden');
        turnIndicator.textContent = `${players[currentPlayerIndex].name}'s Turn`;
        turnIndicator.style.color = players[currentPlayerIndex].color;
        player1Progress.classList.add('hidden');
        player2Progress.classList.add('hidden');
        player1Score.classList.add('hidden');
        player2Score.classList.add('hidden');
    } else {
        turnIndicator.classList.add('hidden');
    }

    Array.from(board.children).forEach(cell => {
        cell.textContent = '';
        cell.style.color = '';
        cell.style.opacity = '1';
        cell.classList.remove('board-cell-win');
    });
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            highlightWinningCombination(combination);
            isGameActive = false;
            return true;
        }
    }
    return false;
}

function highlightWinningCombination(combination) {
    combination.forEach(index => {
        board.children[index].classList.add('board-cell-win');
    });
}
