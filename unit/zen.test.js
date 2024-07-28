import { expect, test, beforeEach, vi } from 'vitest';
import { zenClick, resetZen } from '../src/zen.js';
import { setGameBoard, setCurrentPlayerIndex, setIsGameActive, gameBoard, players, setBoardMock, turnIndicator, checkWinner, isGameActive } from '../src/game.js';
import * as utilities from '../src/utilities.js';

const boardMock = {
    children: Array.from({ length: 9 }, () => document.createElement('div'))
};
const turnIndicatorMock = document.createElement('p');
const buttonResetZenMock = document.createElement('button');

beforeEach(() => {
    setBoardMock(boardMock);

    vi.spyOn(utilities, 'getElementById').mockImplementation(id => {
        if (id === 'board') return boardMock;
        if (id === 'turn-indicator') return turnIndicatorMock;
        if (id === 'button-reset-zen') return buttonResetZenMock;
        return null;
    });

    vi.spyOn(utilities, 'addEventListenerToElement').mockImplementation((element, event, callback) => {
        if (element) {
            element.addEventListener(event, callback);
        }
    });

    vi.spyOn(utilities, 'setElementText').mockImplementation((element, text) => {
        if (element) {
            element.textContent = text;
        }
    });

    vi.spyOn(utilities, 'setElementStyle').mockImplementation((element, property, value) => {
        if (element) {
            element.style[property] = value;
        }
    });

    setGameBoard(['', '', '', '', '', '', '', '', '']);
    setCurrentPlayerIndex(0);
    setIsGameActive(true);
});

test('Correctly place an X or O in the block based on current player.', () => {
    setCurrentPlayerIndex(0);
    zenClick(0);
    expect(gameBoard[0]).toBe('X');
    setCurrentPlayerIndex(1);
    zenClick(1);
    expect(gameBoard[1]).toBe('O');
});

const winningCombinations = [
    ['X', 'X', 'X', '', '', '', '', '', ''],
    ['X', '', '', 'X', '', '', 'X', '', ''],
    ['', 'X', '', '', 'X', '', '', 'X', ''],
    ['', '', 'X', '', '', 'X', '', '', 'X'],
    ['X', '', '', '', 'X', '', '', '', 'X'],
    ['', '', 'X', '', 'X', '', 'X', '', '']
];

test('Register any X win.', () => {
    winningCombinations.forEach(combination => {
        setGameBoard(combination);
        expect(checkWinner()).toBe(true);
    });
});

const winningCombinationsO = winningCombinations.map(combination =>
    combination.map(cell => (cell === 'X' ? 'O' : cell))
);

test('Register any O win.', () => {
    winningCombinationsO.forEach(combination => {
        setGameBoard(combination);
        expect(checkWinner()).toBe(true);
    });
});

const drawCombinations = [
    ['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O'],
    ['O', 'X', 'O', 'O', 'X', 'O', 'X', 'O', 'X'],
    ['X', 'X', 'O', 'O', 'O', 'X', 'X', 'X', 'O'],
    ['O', 'O', 'X', 'X', 'X', 'O', 'O', 'O', 'X']
];

test('Register a draw.', () => {
    drawCombinations.forEach(combination => {
        setGameBoard(combination);
        expect(checkWinner()).toBe(false);
    });
});
