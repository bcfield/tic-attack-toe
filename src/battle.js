let roundCounter = 0;
const maxRounds = 5;

function startBattleRound() {
    if (roundCounter >= maxRounds) {
        displayFinalResults();
        return;
    }

    roundCounter++;
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    Array.from(board.children).forEach(cell => {
        cell.textContent = '';
        cell.style.color = '';
        cell.style.opacity = '1';
        cell.classList.remove('winning-cell');
    });

    // Alternate the first player for each round
    if (roundCounter > 1) {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    resetPlayerDisplay();
    updatePlayerTurnDisplay();
    createBattleBoard();

    // Set progress bar colors based on player colors
    player1ProgressBar.style.backgroundColor = players[0].color;
    player2ProgressBar.style.backgroundColor = players[1].color;

    // Display player names
    player1NameDisplay.style.color = players[0].color;
    player2NameDisplay.style.color = players[1].color;
    player1NameDisplay.textContent = players[0].name;
    player2NameDisplay.textContent = players[1].name;

    // Start timers
    startBattlePlayerTimers();
    isGameActive = true;
}

function startBattlePlayerTimers() {
    let player1Time = 10;
    let player2Time = 10;

    player1ProgressBar.style.width = '100%';
    player2ProgressBar.style.width = '100%';

    const playerTimers = setInterval(() => {
        if (currentPlayerIndex === 0) {
            player1Time -= 0.1;
            player1ProgressBar.style.width = `${(player1Time / 10) * 100}%`;
            if (player1Time <= 0) {
                clearInterval(playerTimers);
                handleBattleTimeout(1); // Player 2 wins
            }
        } else {
            player2Time -= 0.1;
            player2ProgressBar.style.width = `${(player2Time / 10) * 100}%`;
            if (player2Time <= 0) {
                clearInterval(playerTimers);
                handleBattleTimeout(0); // Player 1 wins
            }
        }

        updatePlayerTurnDisplay();
    }, 100);
}

function updatePlayerTurnDisplay() {
    if (currentPlayerIndex === 0) {
        player1ProgressBar.style.opacity = '1';
        player1NameDisplay.style.opacity = '1';
        player2ProgressBar.style.opacity = '0.5';
        player2NameDisplay.style.opacity = '0.5';
    } else {
        player1ProgressBar.style.opacity = '0.5';
        player1NameDisplay.style.opacity = '0.5';
        player2ProgressBar.style.opacity = '1';
        player2NameDisplay.style.opacity = '1';
    }
}

function handleBattleTimeout(winnerIndex) {
    displayBattleResult(`${players[winnerIndex].name} wins by timeout!`, winnerIndex);
    players[winnerIndex].score += 500;
    isGameActive = false;
    setTimeout(showScoreboard, 3000); // Show scoreboard after result
}

function createBattleBoard() {
    board.innerHTML = '';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.addEventListener('click', () => handleBattleClick(index));
        board.appendChild(cellElement);
    });
}

function handleBattleClick(index) {
    if (gameBoard[index] !== '') return;

    gameBoard[index] = players[currentPlayerIndex].symbol;
    const cellElement = board.children[index];
    cellElement.textContent = players[currentPlayerIndex].symbol;
    cellElement.style.color = players[currentPlayerIndex].color;

    if (checkBattleWinner()) {
        displayBattleResult(`${players[currentPlayerIndex].name} is victorious!`, currentPlayerIndex);
        players[currentPlayerIndex].score += 500;
        setTimeout(showScoreboard, 3000); // Show scoreboard after result
        isGameActive = false;
        return;
    }

    if (!gameBoard.includes('')) {
        displayBattleResult('It\'s a draw!', null);
        players[0].score += parseInt(player1ProgressBar.style.width) * 10;
        players[1].score += parseInt(player2ProgressBar.style.width) * 10;
        setTimeout(showScoreboard, 3000); // Show scoreboard after result
        return;
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    updatePlayerTurnDisplay();
}

function checkBattleWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            highlightBattleWinningCombination(combination);
            return true;
        }
    }

    return false;
}

function highlightBattleWinningCombination(combination) {
    combination.forEach(index => {
        board.children[index].classList.add('winning-cell');
    });
}

function displayBattleResult(message, winnerIndex) {
    isGameActive = false;
    if (winnerIndex !== null) {
        const loserIndex = winnerIndex === 0 ? 1 : 0;

        players[winnerIndex].score += 500;

        if (winnerIndex === 0) {
            player1NameDisplay.textContent = message;
            player1ProgressBar.style.opacity = '1';
            player1NameDisplay.style.opacity = '1';
            player2ProgressBar.style.opacity = '0.5';
            player2NameDisplay.style.opacity = '0.5';
        } else {
            player2NameDisplay.textContent = message;
            player2ProgressBar.style.opacity = '1';
            player2NameDisplay.style.opacity = '1';
            player1ProgressBar.style.opacity = '0.5';
            player1NameDisplay.style.opacity = '0.5';
        }
    } else {
        player1NameDisplay.textContent = "It's a Draw!";
        player2NameDisplay.textContent = "It's a Draw!";
        player1ProgressBar.style.opacity = '1';
        player2ProgressBar.style.opacity = '1';
    }

    Array.from(board.children).forEach(cell => {
        cell.style.opacity = '0.5';
    });
}

function resetPlayerDisplay() {
    player1NameDisplay.textContent = players[0].name;
    player2NameDisplay.textContent = players[1].name;
    player1ProgressBar.style.opacity = '1';
    player2ProgressBar.style.opacity = '1';
}

function displayFinalResults() {
    const player1Score = players[0].score;
    const player2Score = players[1].score;
    let finalMessage;

    if (player1Score > player2Score) {
        finalMessage = `Game over! ${players[0].name} wins with ${player1Score} points!`;
    } else if (player2Score > player1Score) {
        finalMessage = `Game over! ${players[1].name} wins with ${player2Score} points!`;
    } else {
        finalMessage = `Game over! It's a draw with both players scoring ${player1Score} points!`;
    }

    turnIndicator.textContent = finalMessage;
    // Optionally, display the scores and other details on the screen
}
