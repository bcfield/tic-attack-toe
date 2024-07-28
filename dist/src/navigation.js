import { nextScreen, showCountdown, setGameMode, buttonResetZen, player1Progress, player2Progress, fadeOutElement, fadeInElement } from './game.js';

export const gameTitle = document.getElementById('game-title');

export const icons = document.getElementById('icons');
export const iconHome = document.getElementById('icon-home');
export const iconFullscreen = document.getElementById('icon-fullscreen');
export const iconFullscreenExit = document.getElementById('icon-fullscreen-exit');

export const screenWelcome = document.getElementById('screen-welcome');
export const screenPlayer1 = document.getElementById('screen-player1');
export const screenPlayer2 = document.getElementById('screen-player2');
export const screenGameMode = document.getElementById('screen-game-mode');

export const buttonBegin = document.getElementById('button-begin');
export const buttonNextPlayer1 = document.getElementById('button-next-player1');
export const buttonNextPlayer2 = document.getElementById('button-next-player2');
export const buttonStartZen = document.getElementById('button-start-zen');
export const buttonStartBattle = document.getElementById('button-start-battle');

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
    setGameMode('zen');
    buttonResetZen.style.display = 'block';
    fadeOutElement(screenGameMode, () => {
        showCountdown();
    });
});

buttonStartBattle.addEventListener('click', () => {
    setGameMode('battle');
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

export function enterFullscreen() {
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

export function exitFullscreen() {
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
