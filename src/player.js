const welcomeScreen = document.getElementById('welcome-screen');
const historyScreen = document.getElementById('history-screen');
const player1Setup = document.getElementById('player1-setup');
const player2Setup = document.getElementById('player2-setup');
const modeSetup = document.getElementById('game-mode-setup');
const gameSetup = document.getElementById('game-setup');
const countdownScreen = document.getElementById('countdown-screen');
const countdownMessage = document.getElementById('countdown-message');
const countdownTimer = document.getElementById('countdown-timer');
const scoreboardScreen = document.getElementById('scoreboard-screen');
const roundResults = document.getElementById('round-results');
const nextPlayer = document.getElementById('next-player');

const startJourneyButton = document.getElementById('start-journey');
const player1NextButton = document.getElementById('player1-next');
const player2NextButton = document.getElementById('player2-next');
const startGameButton = document.getElementById('start-game');
const startGameBattleButton = document.getElementById('start-game-battle');
const gameTitle = document.getElementById('game-title');

const controlIcons = document.getElementById('control-icons');
const homeIcon = document.getElementById('home-icon');
const fullscreenIcon = document.getElementById('fullscreen-icon');
const fullscreenExitIcon = document.getElementById('fullscreen-exit-icon');
const showWelcomeButton = document.getElementById('show-welcome');

const resetGameButton = document.getElementById('reset-game');

const board = document.getElementById('tic-tac-toe-board');
const turnIndicator = document.getElementById('turn-indicator');
const player1ProgressBar = document.getElementById('player1-progress-bar');
const player2ProgressBar = document.getElementById('player2-progress-bar');
const player1NameDisplay = document.getElementById('player1-name-display');
const player2NameDisplay = document.getElementById('player2-name-display');


let players = [
    { name: '', color: '', symbol: 'X', score: 0 },
    { name: '', color: '', symbol: 'O', score: 0 }
];

let gameMode = 'zen';
let isGameActive = false;

let currentPlayerIndex = 0;
let gameBoard = ['', '', '', '', '', '', '', '', ''];

startJourneyButton.addEventListener('click', () => {
    gameTitle.classList.add('slide-up');
    controlIcons.classList.remove('hidden');
    controlIcons.classList.remove('fade-out');
    controlIcons.classList.add('fade-in');

    fadeOut(welcomeScreen, () => fadeIn(player1Setup, () => {
        document.getElementById('player1-name').focus();
    }));
});

showWelcomeButton.addEventListener('click', () => {
    fadeOut(historyScreen, () => fadeIn(welcomeScreen));
});

player1NextButton.addEventListener('click', () => {
    proceedToNextSetup('player1', player2Setup);
});

player2NextButton.addEventListener('click', () => {
    proceedToNextSetup('player2', modeSetup);
});

startGameButton.addEventListener('click', () => {
    gameMode = 'zen';
    resetGameButton.style.display = 'block'; // Show reset button for zen mode
    fadeOut(modeSetup, () => {
        showCountdown();
    });
});

startGameBattleButton.addEventListener('click', () => {
    gameMode = 'battle';
    resetGameButton.style.display = 'none'; // Hide reset button for battle mode
    player1ProgressBar.classList.remove('hidden');
    player2ProgressBar.classList.remove('hidden');
    fadeOut(modeSetup, () => {
        showCountdown();
    });
});

document.addEventListener('keydown', (event) => {
    if (!isGameActive) return;

    const keyBindings = {
        'q': 0, 'w': 1, 'e': 2,
        'a': 3, 's': 4, 'd': 5,
        'z': 6, 'x': 7, 'c': 8,
        'i': 0, 'o': 1, 'p': 2,
        'k': 3, 'l': 4, ';': 5,
        ',': 6, '.': 7, '/': 8,
        '7': 0, '8': 1, '9': 2,
        '4': 3, '5': 4, '6': 5,
        '1': 6, '2': 7, '3': 8
    };
    if (keyBindings.hasOwnProperty(event.key)) {
        if (gameMode === 'zen') {
            handleZenClick(keyBindings[event.key]);
        } else if (gameMode === 'battle') {
            handleBattleClick(keyBindings[event.key]);
        }
    }
});

document.querySelectorAll('.color-circle').forEach(circle => {
    circle.addEventListener('click', (e) => {
        const parent = e.target.parentElement;
        parent.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
        e.target.classList.add('selected');

        const setupId = parent.id === 'player1-colors' ? 'player1' : 'player2';
        const nameInput = document.getElementById(`${setupId}-name`).value;
        const nextButton = document.getElementById(`${setupId}-next`);

        if (nameInput) {
            proceedToNextSetup(setupId, setupId === 'player1' ? player2Setup : modeSetup);
        } else {
            nextButton.disabled = true;
        }

        if (setupId === 'player1') {
            disableSelectedColor(e.target.dataset.color);
        }
    });
});

function proceedToNextSetup(playerId, nextSetup) {
    const playerName = document.getElementById(`${playerId}-name`).value;
    const selectedColor = document.querySelector(`#${playerId}-colors .selected`);

    if (playerName && selectedColor) {
        players[playerId === 'player1' ? 0 : 1] = { 
            name: playerName, 
            color: selectedColor.dataset.color, 
            symbol: playerId === 'player1' ? 'X' : 'O',
            score: 0 
        };
        fadeOut(document.getElementById(`${playerId}-setup`), () => fadeIn(nextSetup, () => {
            if (playerId === 'player1') {
                document.getElementById('player2-name').focus();
            }
        }));
    } else {
        const nextButton = document.getElementById(`${playerId}-next`);
        nextButton.disabled = true;
    }
}

function fadeIn(element, callback) {
    element.style.opacity = 0;
    element.style.display = 'block';

    let last = +new Date();
    const tick = function() {
        element.style.opacity = +element.style.opacity + (new Date() - last) / 400;
        last = +new Date();

        if (+element.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        } else if (callback) {
            callback();
        }
    };

    tick();
}

function fadeOut(element, callback) {
    element.style.opacity = 1;

    let last = +new Date();
    const tick = function() {
        element.style.opacity = +element.style.opacity - (new Date() - last) / 400;
        last = +new Date();

        if (+element.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        } else {
            element.style.display = 'none';
            if (callback) {
                callback();
            }
        }
    };

    tick();
}

function disableSelectedColor(color) {
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

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
        const setupId = e.target.id.includes('player1') ? 'player1' : 'player2';
        const colorSelected = document.querySelector(`#${setupId}-colors .selected`);
        const nextButton = document.getElementById(`${setupId}-next`);
        if (e.target.value && colorSelected) {
            nextButton.disabled = false;
        } else {
            nextButton.disabled = true;
        }
    });
});

function showCountdown() {
    currentPlayerIndex = Math.floor(Math.random() * 2);
    countdownMessage.textContent = `${players[currentPlayerIndex].name} goes first`;
    countdownTimer.textContent = '5';
    fadeIn(countdownScreen);

    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown -= 1;
        if (countdown > 0) {
            countdownTimer.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            fadeOut(countdownScreen, () => {
                fadeIn(gameSetup);
                if (gameMode === 'battle') {
                    startBattleRound();
                } else {
                    createZenBoard();
                    turnIndicator.textContent = `${players[currentPlayerIndex].name}\'s Turn`;
                    isGameActive = true;
                }
            });
        }
    }, 1000);
}

function showScoreboard() {
    fadeOut(gameSetup, () => {
        updateScoreboard();
        fadeIn(scoreboardScreen);
    });
}

function updateScoreboard() {
    let results = `Round ${roundCounter} Results:\n`;
    results += `${players[0].name}: ${players[0].score} points\n`;
    results += `${players[1].name}: ${players[1].score} points\n`;

    roundResults.textContent = results;
    nextPlayer.textContent = `${players[currentPlayerIndex].name} (${players[currentPlayerIndex].symbol}) will go first next round!`;

    let countdown = 3;
    countdownTimer.textContent = countdown;

    const countdownInterval = setInterval(() => {
        countdown -= 1;
        if (countdown > 0) {
            countdownTimer.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            fadeOut(scoreboardScreen, () => {
                fadeIn(gameSetup);
                startBattleRound();
            });
        }
    }, 1000);
}

function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
    fullscreenIcon.classList.add('hidden');
    fullscreenExitIcon.classList.remove('hidden');
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
    fullscreenIcon.classList.remove('hidden');
    fullscreenExitIcon.classList.add('hidden');
}

fullscreenIcon.addEventListener('click', enterFullscreen);
fullscreenExitIcon.addEventListener('click', exitFullscreen);

homeIcon.addEventListener('click', () => {
    location.reload();
});
