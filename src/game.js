export let globalBoard = document.getElementById('board');

export function setBoardMock(mock) {
    globalBoard = mock;
}

export const screenGame = document.getElementById('screen-game');
export const screenCountdown = document.getElementById('screen-countdown');
export const screenWinner = document.getElementById('screen-winner');
export const countdownMessage = document.getElementById('countdown-message');
export const countdownTimer = document.getElementById('countdown-timer');
export const countdownPlayer = document.getElementById('countdown-player');

export const buttonResetZen = document.getElementById('button-reset-zen');
export const buttonResetBattle = document.getElementById('button-reset-battle');

export const turnTimer = document.getElementById('turn-timer');
export const turnIndicator = document.getElementById('turn-indicator');
export const player1Info = document.getElementById('player1-info');
export const player2Info = document.getElementById('player2-info');
export const player1Progress = document.getElementById('player1-progress');
export const player2Progress = document.getElementById('player2-progress');
export const player1Name = document.getElementById('player1-name');
export const player2Name = document.getElementById('player2-name');
export const player1Score = document.getElementById('player1-score');
export const player2Score = document.getElementById('player2-score');

export const screenPlayer2 = document.getElementById('screen-player2');
export const screenGameMode = document.getElementById('screen-game-mode');

export let players = [
    { name: '', color: '', symbol: 'X', score: 0 },
    { name: '', color: '', symbol: 'O', score: 0 }
];

export let gameMode = 'zen';
export let isGameActive = false;

export let currentPlayerIndex = 0;
export let gameBoard = ['', '', '', '', '', '', '', '', ''];

export function setGameBoard(board) {
    gameBoard = board;
}

export function setCurrentPlayerIndex(index) {
    currentPlayerIndex = index;
}

export function setIsGameActive(state) {
    isGameActive = state;
}

export function setGameMode(mode) {
    gameMode = mode;
}

export function nextScreen(playerId, nextSetup) {
    const playerName = document.getElementById(`${playerId}-name-input`).value;
    const selectedColor = document.querySelector(`#${playerId}-colors .selected`);

    if (playerName && selectedColor) {
        players[playerId === 'player1' ? 0 : 1] = { 
            name: playerName, 
            color: selectedColor.dataset.color, 
            symbol: playerId === 'player1' ? 'X' : 'O',
            score: 0 
        };
        fadeOutElement(document.getElementById(`screen-${playerId}`), () => fadeInElement(nextSetup, () => {
            if (playerId === 'player1') {
                document.getElementById('player2-name-input').focus();
            }
        }));
    } else {
        const nextButton = document.getElementById(`${playerId}-next`);
        nextButton.disabled = true;
    }
}

export function disableSelectedColor(color) {
    document.querySelectorAll('#player2-colors .color-circle').forEach(circle => {
        if (circle.dataset.color === color) {
            circle.classList.add('disabled');
            circle.style.pointerEvents = 'none';
        } else {
            circle.classList.remove('disabled');
            circle.style.pointerEvents = 'auto';
        }
    });
}

export function fadeOutElement(element, callback) {
    element.classList.remove('fade-in');
    element.classList.add('fade-out');
    setTimeout(() => {
        element.classList.add('hidden');
        if (callback) callback();
    }, 500);
}

export function fadeInElement(element, callback) {
    element.classList.remove('fade-out');
    element.classList.add('fade-in');
    element.classList.remove('hidden');
    setTimeout(() => {
        if (callback) callback();
    }, 500);
}

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
            import('./zen.js').then(module => {
                module.zenClick(cellIndex);
            });
        } else if (gameMode === 'battle') {
            import('./battle.js').then(module => {
                module.battleClick(cellIndex);
            });
        }
    } else if (currentPlayerIndex === 1 && keyBindingsPlayer2.hasOwnProperty(event.key)) {
        const cellIndex = keyBindingsPlayer2[event.key];
        if (gameMode === 'zen') {
            import('./zen.js').then(module => {
                module.zenClick(cellIndex);
            });
        } else if (gameMode === 'battle') {
            import('./battle.js').then(module => {
                module.battleClick(cellIndex);
            });
        }
    }
});

export function showCountdown() {
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
                    import('./battle.js').then(module => {
                        module.startRound();
                    });
                } else {
                    createBoard();
                    turnIndicator.textContent = `${players[currentPlayerIndex].name}'s Turn`;
                    isGameActive = true;
                }
            }, 500);
        }
    }, 1000);
}

export function createBoard() {
    globalBoard.innerHTML = '';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('board-cell');
        if (gameMode === 'zen') {
            import('./zen.js').then(module => {
                cellElement.addEventListener('click', () => module.zenClick(index));
            });
        } else {
            import('./battle.js').then(module => {
                cellElement.addEventListener('click', () => module.battleClick(index));
            });
        }
        globalBoard.appendChild(cellElement);
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

    Array.from(globalBoard.children).forEach(cell => {
        cell.textContent = '';
        cell.style.color = '';
        cell.style.opacity = '1';
        cell.classList.remove('board-cell-win');
    });
}

export function checkWinner() {
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
        globalBoard.children[index].classList.add('board-cell-win');
    });
}
