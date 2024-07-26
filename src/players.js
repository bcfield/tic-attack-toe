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

function nextScreen(playerId, nextSetup) {
    const playerName = document.getElementById(`${playerId}-name-input`).value;
    const selectedColor = document.querySelector(`#${playerId}-colors .selected`);

    if (playerName && selectedColor) {
        players[playerId === 'player1' ? 0 : 1] = { 
            name: playerName, 
            color: selectedColor.dataset.color, 
            symbol: playerId === 'player1' ? 'X' : 'O',
            score: 0 
        };
        fadeOutElement(document.getElementById(`screen-${playerId}`), () => fadeInElement(nextSetup, () => {
            if (playerId === 'player1') {
                document.getElementById('player2-name-input').focus();
            }
        }));
    } else {
        const nextButton = document.getElementById(`${playerId}-next`);
        nextButton.disabled = true;
    }
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
