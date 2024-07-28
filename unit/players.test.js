import { disableSelectedColor, nextScreen } from '../src/game.js';

test('Ensure disableSelectedColor disables the correct color', () => {
    document.body.innerHTML = `
        <div id="player2-colors">
            <div class="color-circle" data-color="#31102f"></div>
            <div class="color-circle" data-color="#5b0134"></div>
        </div>`;
    disableSelectedColor('#31102f');
    const disabledCircle = document.querySelector('#player2-colors .color-circle[data-color="#31102f"]');
    expect(disabledCircle.classList.contains('disabled')).toBe(true);
    expect(disabledCircle.style.pointerEvents).toBe('none');
});
