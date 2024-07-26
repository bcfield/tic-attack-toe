buttonResetZen.addEventListener('click', () => {
    resetZen();
});

function zenClick(index) {
    if (gameBoard[index] !== '') return;
    if (!isGameActive) return;

    gameBoard[index] = players[currentPlayerIndex].symbol;
    const cellElement = board.children[index];
    cellElement.textContent = players[currentPlayerIndex].symbol;
    cellElement.style.color = players[currentPlayerIndex].color;

    if (checkWinner()) {
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

function displayZenResult(message, isWin) {
    turnIndicator.textContent = message;

    if (isWin) {
        Array.from(board.children).forEach(cell => {
            if (!cell.classList.contains('board-cell-win')) {
                cell.style.opacity = '0.5';
            }
        });
    } else {
        Array.from(board.children).forEach(cell => {
            cell.style.opacity = '0.5';
        });
    }
}

function resetZen() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    Array.from(board.children).forEach(cell => {
        cell.textContent = '';
        cell.style.color = '';
        cell.style.opacity = '1';
        cell.classList.remove('board-cell-win');
    });
    currentPlayerIndex = Math.floor(Math.random() * 2);
    turnIndicator.textContent = `${players[currentPlayerIndex].name}'s Turn`;
    isGameActive = true;
}
