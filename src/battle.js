const maxRounds = 5;
const countdownTime = 5;
const player1TotalTime = 10;
const player2TotalTime = 10;
let roundCounter = 0;
let playerTimers;
let roundStarted = false;

function startBattleRound() {
    if (roundStarted) {
        return;
    }

    roundStarted = true;

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

    turnIndicator.classList.add('hidden');

    // Display player names
    player1NameDisplay.textContent = players[0].name;
    player2NameDisplay.textContent = players[1].name;
    
    // Set progress bar colors based on player colors
    player1ProgressBar.style.backgroundColor = players[0].color;
    player2ProgressBar.style.backgroundColor = players[1].color;
    player1NameDisplay.style.color = players[0].color;
    player2NameDisplay.style.color = players[1].color;
    player1ScoreDisplay.style.color = players[0].color;
    player2ScoreDisplay.style.color = players[1].color;

    // Start timers
    startBattlePlayerTimers();
    isGameActive = true;
}

function startBattlePlayerTimers() {
    let player1Time = player1TotalTime;
    let player2Time = player2TotalTime;

    player1ProgressBar.style.width = '100%';
    player2ProgressBar.style.width = '100%';

    clearInterval(playerTimers); // Clear any existing timer

    playerTimers = setInterval(() => {
        if (currentPlayerIndex === 0) {
            player1Time -= 0.1;
            player1ProgressBar.style.width = `${(player1Time / player1TotalTime) * 100}%`;
            if (player1Time <= 0) {
                clearInterval(playerTimers);
                handleBattleTimeout(1); // Player 2 wins
            }
        } else {
            player2Time -= 0.1;
            player2ProgressBar.style.width = `${(player2Time / player2TotalTime) * 100}%`;
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
        player1Info.style.opacity = '1';
        player2Info.style.opacity = '0.5';
    } else {
        player1Info.style.opacity = '0.5';
        player2Info.style.opacity = '1';
    }
}

function animateScoreIncrement(playerScoreDisplay, startScore, endScore) {
    const duration = 2000; // Duration in milliseconds
    const frameRate = 60; // Frames per second
    const increment = (endScore - startScore) / (duration / frameRate); // Increment per frame
    let currentScore = startScore;
    
    const interval = setInterval(() => {
        currentScore += increment;
        if ((increment > 0 && currentScore >= endScore) || (increment < 0 && currentScore <= endScore)) {
            currentScore = endScore;
            clearInterval(interval);
        }
        playerScoreDisplay.textContent = Math.round(currentScore);
    }, 1000 / frameRate); // Interval per frame
}

function showScoreboard() {
    fadeOut(gameSetup, () => {
        updateScoreboard();
        fadeIn(scoreboardScreen);
    });
}

function updateScoreboard() {
    let nextRound = roundCounter + 1;
    nextPlayer.textContent = `${players[currentPlayerIndex === 0 ? 1 : 0].name} goes first`;
    if (nextRound === maxRounds) {
        roundCounterMessage.textContent = `final round starts in`;
    } else {
        roundCounterMessage.textContent = `round ${nextRound} starts in`;
    }

    let countdown = countdownTime;
    roundTimer.textContent = countdown;

    const countdownInterval = setInterval(() => {
        countdown -= 1;
        if (countdown > 0) {
            roundTimer.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            fadeOut(scoreboardScreen, () => {
                fadeIn(gameSetup);
                roundStarted = false; // Reset the flag before starting the next round
                startBattleRound();
            });
        }
    }, 1000);
}

function updatePlayerScores(winnerIndex) {
    if (winnerIndex !== null) {
        const winnerScoreDisplay = winnerIndex === 0 ? player1ScoreDisplay : player2ScoreDisplay;
        
        const startScore = players[winnerIndex].score - 1000;
        const endScore = players[winnerIndex].score;
        
        animateScoreIncrement(winnerScoreDisplay, startScore, endScore);
    } else {
        const player1ProgressScore = Math.round(parseFloat(player1ProgressBar.style.width) * 10);
        const player2ProgressScore = Math.round(parseFloat(player2ProgressBar.style.width) * 10);

        players[0].score += player1ProgressScore;
        players[1].score += player2ProgressScore;

        const startScore1 = players[0].score - player1ProgressScore;
        const endScore1 = players[0].score;
        
        const startScore2 = players[1].score - player2ProgressScore;
        const endScore2 = players[1].score;
        
        animateScoreIncrement(player1ScoreDisplay, startScore1, endScore1);
        animateScoreIncrement(player2ScoreDisplay, startScore2, endScore2);
    }
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

function handleBattleTimeout(winnerIndex) {
    clearInterval(playerTimers); // Stop the timers
    displayBattleResult(`${players[winnerIndex].name} wins by timeout!`, winnerIndex);
    isGameActive = false;
    if (roundCounter < maxRounds) {
        setTimeout(showScoreboard, 3000); // Show scoreboard after result
    } else {
        setTimeout(displayFinalResults, 3000); // Show final results after last round
    }
}

function handleBattleClick(index) {
    if (gameBoard[index] !== '') return;
    if (!isGameActive) return;

    gameBoard[index] = players[currentPlayerIndex].symbol;
    const cellElement = board.children[index];
    cellElement.textContent = players[currentPlayerIndex].symbol;
    cellElement.style.color = players[currentPlayerIndex].color;

    if (checkBattleWinner()) {
        clearInterval(playerTimers); // Stop the timers
        displayBattleResult(`${players[currentPlayerIndex].name} is victorious!`, currentPlayerIndex);
        isGameActive = false;
        setTimeout(() => {
            if (roundCounter < maxRounds) {
                showScoreboard();
            } else {
                displayFinalResults();
            }
        }, 3000); // Show scoreboard or final results after result
        return;
    }

    if (!gameBoard.includes('')) {
        clearInterval(playerTimers); // Stop the timers
        displayBattleResult('It\'s a draw!', null);
        // Remove the redundant score increment from here
        setTimeout(() => {
            if (roundCounter < maxRounds) {
                showScoreboard();
            } else {
                displayFinalResults();
            }
        }, 3000); // Show scoreboard or final results after result
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
        players[winnerIndex].score += 1000;

        if (winnerIndex === 0) {
            player1NameDisplay.textContent = message;
            player1Info.style.opacity = '1';
            player2Info.style.opacity = '0.5';
        } else {
            player2NameDisplay.textContent = message;
            player1Info.style.opacity = '0.5';
            player2Info.style.opacity = '1';
        }
    } else {
        player1NameDisplay.textContent = "It's a Draw!";
        player2NameDisplay.textContent = "It's a Draw!";
        player1Info.style.opacity = '1';
        player2Info.style.opacity = '1';
    }

    Array.from(board.children).forEach(cell => {
        cell.style.opacity = '0.5';
    });

    updatePlayerScores(winnerIndex);
}

function resetPlayerDisplay() {
    player1NameDisplay.textContent = players[0].name;
    player2NameDisplay.textContent = players[1].name;
    player1Info.style.opacity = '1';
    player2Info.style.opacity = '1';
}

function displayFinalResults() {
    const player1Score = players[0].score;
    const player2Score = players[1].score;

    if (player1Score > player2Score) {
        player1NameDisplay.textContent = `${players[0].name} is victorious!`;
        player2NameDisplay.textContent = `${players[1].name} is defeated!`;
    } else if (player2Score > player1Score) {
        player2NameDisplay.textContent = `${players[1].name} is victorious!`;
        player1NameDisplay.textContent = `${players[0].name} is defeated!`;
    } else {
        player1NameDisplay.textContent = `${players[0].name} has drawn the match!`;
        player2NameDisplay.textContent = `${players[1].name} has drawn the match!`;
    }

    player1Info.style.opacity = '1';
    player2Info.style.opacity = '1';
    player1ProgressBar.style.width = '100%';
    player2ProgressBar.style.width = '100%';
}
