import { players, gameBoard, turnIndicator, globalBoard, isGameActive, currentPlayerIndex, setGameBoard, setCurrentPlayerIndex, setIsGameActive, checkWinner, player1Info, player2Info, player1Progress, player2Progress, player1Name, player2Name, player1Score, player2Score, screenGame, screenCountdown, countdownMessage, countdownTimer, countdownPlayer, fadeOutElement, fadeInElement, createBoard } from './game.js';

const maxRounds = 5;
const countdownTime = 5;
const player1TotalTime = 5;
const player2TotalTime = 5;
let roundCounter = 0;
let playerTimers;
let roundStarted = false;

export function startRound() {
    if (roundStarted) return;

    roundStarted = true;

    if (roundCounter >= maxRounds) {
        displayFinalResults();
        return;
    }

    roundCounter++;
    if (roundCounter > 1) {
        setCurrentPlayerIndex(currentPlayerIndex === 0 ? 1 : 0);
    }

    resetPlayers();
    updateTurn();
    createBoard();
    startTimers();
    setIsGameActive(true);
}

function startTimers() {
    let player1Time = player1TotalTime;
    let player2Time = player2TotalTime;

    player1Progress.style.width = '100%';
    player2Progress.style.width = '100%';

    clearInterval(playerTimers);

    playerTimers = setInterval(() => {
        if (currentPlayerIndex === 0) {
            player1Time -= 0.1;
            player1Progress.style.width = `${(player1Time / player1TotalTime) * 100}%`;
            if (player1Time <= 0) {
                clearInterval(playerTimers);
                battleTimeout(1);
            }
        } else {
            player2Time -= 0.1;
            player2Progress.style.width = `${(player2Time / player2TotalTime) * 100}%`;
            if (player2Time <= 0) {
                clearInterval(playerTimers);
                battleTimeout(0);
            }
        }
        updateTurn();
    }, 100);
}

function updateTurn() {
    if (currentPlayerIndex === 0) {
        player1Info.style.opacity = '1';
        player2Info.style.opacity = '0.5';
    } else {
        player1Info.style.opacity = '0.5';
        player2Info.style.opacity = '1';
    }
}

function animateScore(playerScoreDisplay, startScore, endScore) {
    const duration = 2000;
    const frameRate = 60;
    const increment = (endScore - startScore) / (duration / frameRate);
    let currentScore = startScore;
    
    const interval = setInterval(() => {
        currentScore += increment;
        if ((increment > 0 && currentScore >= endScore) || (increment < 0 && currentScore <= endScore)) {
            currentScore = endScore;
            clearInterval(interval);
        }
        playerScoreDisplay.textContent = Math.round(currentScore);
    }, 1000 / frameRate);
}

function showScoreboard() {
    screenGame.classList.add('fade-out');
    setTimeout(() => {
        screenGame.classList.add('hidden');
        screenGame.classList.remove('fade-out');
        updateScoreboard();
        screenCountdown.classList.remove('hidden');
        screenCountdown.classList.add('fade-in');
    }, 500);
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
                roundStarted = false;
                startRound();
            }, 500);
        }
    }, 1000);
}

function updateScores(winnerIndex) {
    if (winnerIndex !== null) {
        const winnerScore = winnerIndex === 0 ? player1Score : player2Score;
        
        const startScore = players[winnerIndex].score - 500;
        const endScore = players[winnerIndex].score;
        
        animateScore(winnerScore, startScore, endScore);
    } else {
        const player1ProgressScore = Math.round(parseFloat(player1Progress.style.width) * 10);
        const player2ProgressScore = Math.round(parseFloat(player2Progress.style.width) * 10);

        players[0].score += player1ProgressScore;
        players[1].score += player2ProgressScore;

        const startScore1 = players[0].score - player1ProgressScore;
        const endScore1 = players[0].score;
        
        const startScore2 = players[1].score - player2ProgressScore;
        const endScore2 = players[1].score;
        
        animateScore(player1Score, startScore1, endScore1);
        animateScore(player2Score, startScore2, endScore2);
    }
}

function battleTimeout(winnerIndex) {
    clearInterval(playerTimers);
    displayBattleResult(`${players[winnerIndex].name} wins by timeout!`, winnerIndex);
    setIsGameActive(false);
    if (roundCounter < maxRounds) {
        setTimeout(showScoreboard, 3000);
    } else {
        setTimeout(displayFinalResults, 3000);
    }
}

export function battleClick(index) {
    if (gameBoard[index] !== '') return;
    if (!isGameActive) return;

    gameBoard[index] = players[currentPlayerIndex].symbol;
    const cellElement = globalBoard.children[index];
    cellElement.textContent = players[currentPlayerIndex].symbol;
    cellElement.style.color = players[currentPlayerIndex].color;

    if (checkWinner()) {
        clearInterval(playerTimers);
        displayBattleResult(`${players[currentPlayerIndex].name} wins!`, currentPlayerIndex);
        setIsGameActive(false);
        setTimeout(() => {
            if (roundCounter < maxRounds) {
                showScoreboard();
            } else {
                displayFinalResults();
            }
        }, 3000);
        return;
    }

    if (!gameBoard.includes('')) {
        clearInterval(playerTimers);
        displayBattleResult('It\'s a draw!', null);
        setTimeout(() => {
            if (roundCounter < maxRounds) {
                showScoreboard();
            } else {
                displayFinalResults();
            }
        }, 3000);
        return;
    }

    setCurrentPlayerIndex(currentPlayerIndex === 0 ? 1 : 0);
    updateTurn();
}

function displayBattleResult(message, winnerIndex) {
    setIsGameActive(false);
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

    Array.from(globalBoard.children).forEach(cell => {
        cell.style.opacity = '0.5';
    });

    updateScores(winnerIndex);
}

function resetPlayers() {
    player1Name.textContent = players[0].name;
    player1Name.style.color = players[0].color;
    player1Info.style.opacity = '1';
    player1Progress.style.backgroundColor = players[0].color;
    player1Score.style.color = players[0].color;

    player2Name.textContent = players[1].name;
    player2Name.style.color = players[1].color;
    player2Info.style.opacity = '1';
    player2Progress.style.backgroundColor = players[1].color;
    player2Score.style.color = players[1].color;
}

function displayFinalResults() {
    const player1FinalScore = players[0].score;
    const player2FinalScore = players[1].score;

    if (player1FinalScore > player2FinalScore) {
        player1Name.textContent = `${players[0].name} wins!`;
        player2Name.textContent = `${players[1].name}`;
    } else if (player2FinalScore > player1FinalScore) {
        player2Name.textContent = `${players[1].name} wins!`;
        player1Name.textContent = `${players[0].name}`;
    } else {
        player1Name.textContent = `${players[0].name} has drawn!`;
        player2Name.textContent = `${players[1].name} has drawn!`;
    }

    player1Info.style.opacity = '1';
    player2Info.style.opacity = '1';
    player1Progress.style.width = '100%';
    player2Progress.style.width = '100%';
}
