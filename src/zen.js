resetGameButton.addEventListener('click', () => {
    resetZenGame();
});

function createZenBoard() {
    board.innerHTML = '';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.addEventListener('click', () => handleZenClick(index));
        board.appendChild(cellElement);
    });
    turnIndicator.textContent = `${players[currentPlayerIndex].name}'s Turn`;
    player1ProgressBar.classList.add('hidden');
    player2ProgressBar.classList.add('hidden');

}

function handleZenClick(index) {
    if (gameBoard[index] !== '') return; // Prevent overwriting moves

    gameBoard[index] = players[currentPlayerIndex].symbol;
    const cellElement = board.children[index];
    cellElement.textContent = players[currentPlayerIndex].symbol;
    cellElement.style.color = players[currentPlayerIndex].color;

    if (checkZenWinner()) {
        displayZenResult(`${players[currentPlayerIndex].name} is victorious!`, true);
        return;
    }

    if (!gameBoard.includes('')) {
        displayZenResult('It\'s a draw!', false);
        return;
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    turnIndicator.textContent = `${players[currentPlayerIndex].name}'s Turn`;
}

function checkZenWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            highlightZenWinningCombination(combination);
            isGameActive = false;
            return true;
        }
    }

    return false;
}

function displayZenResult(message, isWin) {
    turnIndicator.textContent = message;

    if (isWin) {
        Array.from(board.children).forEach(cell => {
            if (!cell.classList.contains('winning-cell')) {
                cell.style.opacity = '0.5';
            }
        });
    } else {
        Array.from(board.children).forEach(cell => {
            cell.style.opacity = '0.5';
        });
    }
}

function highlightZenWinningCombination(combination) {
    combination.forEach(index => {
        board.children[index].classList.add('winning-cell');
    });
}

function resetZenGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    Array.from(board.children).forEach(cell => {
        cell.textContent = '';
        cell.style.color = '';
        cell.style.opacity = '1';
        cell.classList.remove('winning-cell');
    });
    currentPlayerIndex = Math.floor(Math.random() * 2);
    turnIndicator.textContent = `${players[currentPlayerIndex].name}'s Turn`;
    isGameActive = true;
}

// Initialize the board
createZenBoard();
