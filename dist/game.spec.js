"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Tic Tac Toe App', () => {
    test_1.test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });
    (0, test_1.test)('should allow clicking on squares to place X or O', async ({ page }) => {
        const firstSquare = page.locator('.board-cell').nth(0);
        await firstSquare.click();
        await (0, test_1.expect)(firstSquare).toHaveText('X');
    });
    (0, test_1.test)('should win a game by getting three Xs in a row', async ({ page }) => {
        const squares = page.locator('.board-cell');
        await squares.nth(0).click(); // X
        await squares.nth(3).click(); // O
        await squares.nth(1).click(); // X
        await squares.nth(4).click(); // O
        await squares.nth(2).click(); // X wins
        await (0, test_1.expect)(page.locator('.game-status')).toHaveText(/X wins/);
    });
    (0, test_1.test)('should end a game in a tie', async ({ page }) => {
        const squares = page.locator('.board-cell');
        await squares.nth(0).click(); // X
        await squares.nth(1).click(); // O
        await squares.nth(2).click(); // X
        await squares.nth(4).click(); // O
        await squares.nth(3).click(); // X
        await squares.nth(5).click(); // O
        await squares.nth(7).click(); // X
        await squares.nth(6).click(); // O
        await squares.nth(8).click(); // X
        await (0, test_1.expect)(page.locator('.game-status')).toHaveText(/It's a draw/);
    });
    (0, test_1.test)('should reset the game when clicking the "Reset" button', async ({ page }) => {
        const firstSquare = page.locator('.board-cell').nth(0);
        await firstSquare.click();
        await (0, test_1.expect)(firstSquare).toHaveText('X');
        const resetButton = page.locator('#button-reset-zen');
        await resetButton.click();
        await (0, test_1.expect)(firstSquare).toHaveText('');
        await (0, test_1.expect)(page.locator('.game-status')).toHaveText('');
    });
});
