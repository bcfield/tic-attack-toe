const maxRounds = 5;
const countdownTime = 5;
const player1TotalTime = 5;
const player2TotalTime = 5;
let roundCounter = 0;
let playerTimers;
let roundStarted = false;

function startBattleRound() {
    if (roundStarted) return;

    roundStarted = true;

    if (roundCounter >= maxRounds) {
        displayFinalResults();
        return;
    }

    roundCounter++;
    if (roundCounter > 1) {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    resetPlayerDisplay();
    updatePlayerTurnDisplay();
    createBoard();
    startBattlePlayerTimers();
    isGameActive = true;
}

function startBattlePlayerTimers() {
    let player1Time = player1TotalTime;
    let player2Time = player2TotalTime;

    player1Progress.style.width = '100%';
    player2Progress.style.width = '100%';

    clearInterval(playerTimers); // Clear any existing timer

    playerTimers = setInterval(() => {
        if (currentPlayerIndex === 0) {
            player1Time -= 0.1;
            player1Progress.style.width = `${(player1Time / player1TotalTime) * 100}%`;
            if (player1Time <= 0) {
                clearInterval(playerTimers);
                handleBattleTimeout(1); // Player 2 wins
            }
        } else {
            player2Time -= 0.1;
            player2Progress.style.width = `${(player2Time / player2TotalTime) * 100}%`;
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
    screenGame.classList.add('fade-out');
    setTimeout(() => {
        screenGame.classList.add('hidden');
        screenGame.classList.remove('fade-out');
        updateScoreboard();
        screenCountdown.classList.remove('hidden');
        screenCountdown.classList.add('fade-in');
    }, 500); // Adjust the delay to match the CSS animation duration
}

function updateScoreboard() {
    let nextRound = roundCounter + 1;
    countdownPlayer.textContent = `${players[currentPlayerIndex === 0 ? 1 : 0].name} goes first`;
    if (nextRound === maxRounds) {
        countdownMessage.textContent = `final round starts in`;
    } else {
        countdownMessage.textContent = `round ${nextRound} starts in`;
    }

    let countdown = countdownTime;
    countdownTimer.textContent = countdown;

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
                roundStarted = false; // Reset the flag before starting the next round
                startBattleRound();
            }, 500); // Adjust the delay to match the CSS animation duration
        }
    }, 1000);
}

function updatePlayerScores(winnerIndex) {
    if (winnerIndex !== null) {
        const winnerScoreDisplay = winnerIndex === 0 ? player1Score : player2Score;
        
        const startScore = players[winnerIndex].score - 500;
        const endScore = players[winnerIndex].score;
        
        animateScoreIncrement(winnerScoreDisplay, startScore, endScore);
    } else {
        const player1ProgressScore = Math.round(parseFloat(player1Progress.style.width) * 10);
        const player2ProgressScore = Math.round(parseFloat(player2Progress.style.width) * 10);

        players[0].score += player1ProgressScore;
        players[1].score += player2ProgressScore;

        const startScore1 = players[0].score - player1ProgressScore;
        const endScore1 = players[0].score;
        
        const startScore2 = players[1].score - player2ProgressScore;
        const endScore2 = players[1].score;
        
        animateScoreIncrement(player1Score, startScore1, endScore1);
        animateScoreIncrement(player2Score, startScore2, endScore2);
    }
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

function battleClick(index) {
    if (gameBoard[index] !== '') return;
    if (!isGameActive) return;

    gameBoard[index] = players[currentPlayerIndex].symbol;
    const cellElement = board.children[index];
    cellElement.textContent = players[currentPlayerIndex].symbol;
    cellElement.style.color = players[currentPlayerIndex].color;

    if (checkWinner()) {
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

function displayBattleResult(message, winnerIndex) {
    isGameActive = false;
    if (winnerIndex !== null) {
        players[winnerIndex].score += 500;

        if (winnerIndex === 0) {
            player1Name.textContent = message;
            player1Info.style.opacity = '1';
            player2Info.style.opacity = '0.5';
        } else {
            player2Name.textContent = message;
            player1Info.style.opacity = '0.5';
            player2Info.style.opacity = '1';
        }
    } else {
        player1Name.textContent = "It's a Draw!";
        player2Name.textContent = "It's a Draw!";
        player1Info.style.opacity = '1';
        player2Info.style.opacity = '1';
    }

    Array.from(board.children).forEach(cell => {
        cell.style.opacity = '0.5';
    });

    updatePlayerScores(winnerIndex);
}

function resetPlayerDisplay() {
    player1Name.textContent = players[0].name;
    player2Name.textContent = players[1].name;
    player1Info.style.opacity = '1';
    player2Info.style.opacity = '1';

    // Display player names
    player1Name.textContent = players[0].name;
    player2Name.textContent = players[1].name;
    
    // Set progress bar colors based on player colors
    player1Progress.style.backgroundColor = players[0].color;
    player2Progress.style.backgroundColor = players[1].color;
    player1Name.style.color = players[0].color;
    player2Name.style.color = players[1].color;
    player1Score.style.color = players[0].color;
    player2Score.style.color = players[1].color;

}

function displayFinalResults() {
    const player1FinalScore = players[0].score;
    const player2FinalScore = players[1].score;

    if (player1FinalScore > player2FinalScore) {
        player1Name.textContent = `${players[0].name} is victorious!`;
        player2Name.textContent = `${players[1].name} is defeated!`;
    } else if (player2FinalScore > player1FinalScore) {
        player2Name.textContent = `${players[1].name} is victorious!`;
        player1Name.textContent = `${players[0].name} is defeated!`;
    } else {
        player1Name.textContent = `${players[0].name} has drawn the match!`;
        player2Name.textContent = `${players[1].name} has drawn the match!`;
    }

    player1Info.style.opacity = '1';
    player2Info.style.opacity = '1';
    player1Progress.style.width = '100%';
    player2Progress.style.width = '100%';
}
