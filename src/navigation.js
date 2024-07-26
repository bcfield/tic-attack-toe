const gameTitle = document.getElementById('game-title');

const icons = document.getElementById('icons');
const iconHome = document.getElementById('icon-home');
const iconFullscreen = document.getElementById('icon-fullscreen');
const iconFullscreenExit = document.getElementById('icon-fullscreen-exit');

const screenWelcome = document.getElementById('screen-welcome');
const screenPlayer1 = document.getElementById('screen-player1');
const screenPlayer2 = document.getElementById('screen-player2');
const screenGameMode = document.getElementById('screen-game-mode');

const buttonBegin = document.getElementById('button-begin');
const buttonNextPlayer1 = document.getElementById('button-next-player1');
const buttonNextPlayer2 = document.getElementById('button-next-player2');
const buttonStartZen = document.getElementById('button-start-zen');
const buttonStartBattle = document.getElementById('button-start-battle');

buttonBegin.addEventListener('click', () => {
    gameTitle.classList.add('slide-up');
    icons.classList.remove('hidden');
    icons.classList.remove('fade-out');
    icons.classList.add('fade-in');

    fadeOutElement(screenWelcome, () => fadeInElement(screenPlayer1, () => {
        document.getElementById('player1-name-input').focus();
    }));
});

buttonNextPlayer1.addEventListener('click', () => {
    nextScreen('player1', screenPlayer2);
});

buttonNextPlayer2.addEventListener('click', () => {
    nextScreen('player2', screenGameMode);
});

buttonStartZen.addEventListener('click', () => {
    gameMode = 'zen';
    buttonResetZen.style.display = 'block';
    fadeOutElement(screenGameMode, () => {
        showCountdown();
    });
});

buttonStartBattle.addEventListener('click', () => {
    gameMode = 'battle';
    buttonResetZen.style.display = 'none';
    player1Progress.classList.remove('hidden');
    player2Progress.classList.remove('hidden');
    fadeOutElement(screenGameMode, () => {
        showCountdown();
    });
});

iconFullscreen.addEventListener('click', enterFullscreen);
iconFullscreenExit.addEventListener('click', exitFullscreen);

iconHome.addEventListener('click', () => {
    location.reload();
});

function fadeInElement(element, callback) {
    element.classList.remove('fade-out');
    element.classList.add('fade-in');
    element.classList.remove('hidden');
    setTimeout(() => {
        if (callback) callback();
    }, 500);
}

function fadeOutElement(element, callback) {
    element.classList.remove('fade-in');
    element.classList.add('fade-out');
    setTimeout(() => {
        element.classList.add('hidden');
        if (callback) callback();
    }, 500);
}

function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
    iconFullscreen.classList.add('hidden');
    iconFullscreenExit.classList.remove('hidden');
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    iconFullscreen.classList.remove('hidden');
    iconFullscreenExit.classList.add('hidden');
}
