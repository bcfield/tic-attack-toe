const welcomeScreen = document.getElementById('welcome-screen');
const historyScreen = document.getElementById('history-screen');
const player1Setup = document.getElementById('player1-setup');
const player2Setup = document.getElementById('player2-setup');
const modeSetup = document.getElementById('game-mode-setup');
const gameSetup = document.getElementById('game-setup');
const countdownScreen = document.getElementById('countdown-screen');
const countdownMessage = document.getElementById('countdown-message');
const countdownTimer = document.getElementById('countdown-timer');

const startJourneyButton = document.getElementById('start-journey');
const player1NextButton = document.getElementById('player1-next');
const player2NextButton = document.getElementById('player2-next');
const startGameButton = document.getElementById('start-game');
const gameTitle = document.getElementById('game-title');

const controlIcons = document.getElementById('control-icons');
const homeIcon = document.getElementById('home-icon');
const fullscreenIcon = document.getElementById('fullscreen-icon');
const fullscreenExitIcon = document.getElementById('fullscreen-exit-icon');
const showHistoryButton = document.getElementById('show-history');
const showWelcomeButton = document.getElementById('show-welcome');

let players = [
    { name: '', color: '', symbol: 'X' },
    { name: '', color: '', symbol: 'O' }
];

startJourneyButton.addEventListener('click', () => {
    gameTitle.classList.add('slide-up');
    controlIcons.classList.remove('hidden');
    controlIcons.classList.remove('fade-out');
    controlIcons.classList.add('fade-in');

    fadeOut(welcomeScreen, () => fadeIn(player1Setup, () => {
        document.getElementById('player1-name').focus();
    }));
});

showHistoryButton.addEventListener('click', () => {
    fadeOut(welcomeScreen, () => fadeIn(historyScreen));
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
    fadeOut(modeSetup, () => {
        showCountdown();
    });
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
        players[playerId === 'player1' ? 0 : 1] = { name: playerName, color: selectedColor.dataset.color, symbol: playerId === 'player1' ? 'X' : 'O' };
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
    element.classList.remove('hidden');
    element.classList.add('fade-in');
    element.classList.remove('fade-out');
    if (callback) {
        callback();
    }
}

function fadeOut(element, callback) {
    element.classList.add('fade-out');
    element.classList.remove('fade-in');
    element.addEventListener('animationend', function handler() {
        element.classList.add('hidden');
        element.removeEventListener('animationend', handler);
        if (callback) {
            callback();
        }
    });
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
    countdownMessage.textContent = `${players[currentPlayerIndex].name} (${players[currentPlayerIndex].symbol}) will go first!`;
    countdownTimer.textContent = '3';
    fadeIn(countdownScreen);

    let countdown = 3;
    const countdownInterval = setInterval(() => {
        countdown -= 1;
        if (countdown > 0) {
            countdownTimer.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            fadeOut(countdownScreen, () => {
                fadeIn(gameSetup);
                createBoard();
                turnIndicator.textContent = `${players[currentPlayerIndex].name} (${players[currentPlayerIndex].symbol}) goes first!`;
                turnIndicator.textContent = `${players[currentPlayerIndex].name}\'s Turn`;
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
