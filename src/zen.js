import { checkWinner, players, gameBoard, isGameActive, currentPlayerIndex, setGameBoard, setCurrentPlayerIndex, setIsGameActive } from './game.js';
import { getElementById, addEventListenerToElement, setElementText, setElementStyle } from './utilities.js';

const buttonResetZen = getElementById('button-reset-zen');
const board = getElementById('board');
const turnIndicator = getElementById('turn-indicator');

addEventListenerToElement(buttonResetZen, 'click', resetZen);

export function zenClick(index) {
    if (gameBoard[index] !== '' || !isGameActive) return;

    gameBoard[index] = players[currentPlayerIndex].symbol;
    const cellElement = board?.children[index];
    setElementText(cellElement, players[currentPlayerIndex].symbol);
    setElementStyle(cellElement, 'color', players[currentPlayerIndex].color);

    if (checkWinner()) {
        displayZenResult(`${players[currentPlayerIndex].name} wins!`, true);
        return;
    }

    if (!gameBoard.includes('')) {
        displayZenResult('It\'s a draw!', false);
        return;
    }

    setCurrentPlayerIndex(currentPlayerIndex === 0 ? 1 : 0);
    setElementText(turnIndicator, `${players[currentPlayerIndex].name}'s Turn`);
    setElementStyle(turnIndicator, 'color', players[currentPlayerIndex].color);
}

function displayZenResult(message, isWin) {
    setElementText(turnIndicator, message);

    Array.from(board?.children || []).forEach(cell => {
        if (!cell.classList.contains('board-cell-win')) {
            setElementStyle(cell, 'opacity', '0.5');
        }
    });
}

export function resetZen() {
    setGameBoard(['', '', '', '', '', '', '', '', '']);
    Array.from(board?.children || []).forEach(cell => {
        setElementText(cell, '');
        setElementStyle(cell, 'color', '');
        setElementStyle(cell, 'opacity', '1');
        cell.classList.remove('board-cell-win');
    });
    setCurrentPlayerIndex(Math.floor(Math.random() * 2));
    setElementText(turnIndicator, `${players[currentPlayerIndex].name}'s Turn`);
    setElementStyle(turnIndicator, 'color', players[currentPlayerIndex].color);
    setIsGameActive(true);
}
