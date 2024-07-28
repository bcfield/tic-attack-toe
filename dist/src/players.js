import { screenPlayer2, screenGameMode, nextScreen, disableSelectedColor } from './game.js';

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
        const setupId = e.target.id.includes('player1') ? 'player1' : 'player2';
        const colorSelected = document.querySelector(`#${setupId}-colors .selected`);
        const nextButton = document.getElementById(`button-next-${setupId}`);
        if (e.target.value && colorSelected) {
            nextButton.disabled = false;
        } else {
            nextButton.disabled = true;
        }
    });
});

document.querySelectorAll('.color-circle').forEach(circle => {
    circle.addEventListener('click', (e) => {
        const parent = e.target.parentElement;
        parent.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
        e.target.classList.add('selected');

        const setupId = parent.id === 'player1-colors' ? 'player1' : 'player2';
        const nameInput = document.getElementById(`${setupId}-name-input`).value;
        const nextButton = document.getElementById(`button-next-${setupId}`);

        if (nameInput) {
            nextScreen(setupId, setupId === 'player1' ? screenPlayer2 : screenGameMode);
        } else {
            nextButton.disabled = true;
        }

        if (setupId === 'player1') {
            disableSelectedColor(e.target.dataset.color);
        }
    });
});
