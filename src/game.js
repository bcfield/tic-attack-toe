const resetGameButton = document.getElementById('reset-game');
const board = document.getElementById('tic-tac-toe-board');
const turnIndicator = document.getElementById('turn-indicator');

let currentPlayerIndex = 0;
let gameBoard = ['', '', '', '', '', '', '', '', ''];

resetGameButton.addEventListener('click', () => {
    resetGame();
});

function createBoard() {
    board.innerHTML = ''; // Clear existing board
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.addEventListener('click', () => handleClick(index));
        board.appendChild(cellElement);
    });
}

function handleClick(index) {
    if (gameBoard[index] !== '') return;

    gameBoard[index] = players[currentPlayerIndex].symbol;
    const cellElement = board.children[index];
    cellElement.textContent = players[currentPlayerIndex].symbol;
    cellElement.style.color = players[currentPlayerIndex].color;

    if (checkWinner()) {
        displayResult(`${players[currentPlayerIndex].name} is victorious!`, true);
        return;
    }

    if (!gameBoard.includes('')) {
        displayResult('It\'s a draw!', false);
        return;
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    turnIndicator.textContent = `${players[currentPlayerIndex].name}'s Turn`;
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
            return true;
        }
    }

    return false;
}

function displayResult(message, isWin) {
    turnIndicator.textContent = message;

    if (isWin) {
        Array.from(board.children).forEach(cell => {
            if (!cell.classList.contains('winning-cell')) {
                cell.style.opacity = '0.5';
            }
        });
    }
}

function highlightWinningCombination(combination) {
    combination.forEach(index => {
        board.children[index].classList.add('winning-cell');
    });
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    Array.from(board.children).forEach(cell => {
        cell.textContent = '';
        cell.style.color = '';
        cell.style.opacity = '1';
        cell.classList.remove('winning-cell');
    });
    currentPlayerIndex = Math.floor(Math.random() * 2);
    turnIndicator.textContent = `${players[currentPlayerIndex].name}'s Turn`;
}

// Initialize the board
createBoard();
