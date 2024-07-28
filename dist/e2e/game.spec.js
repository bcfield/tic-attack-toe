"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Tic Tac Toe App', () => {
    test_1.test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000'); // Adjust the URL as necessary
    });
    (0, test_1.test)('should place X and O on the board', async ({ page }) => {
        const cells = page.locator('.board-cell');
        await cells.nth(0).click();
        await (0, test_1.expect)(cells.nth(0)).toHaveText('X');
        await cells.nth(1).click();
        await (0, test_1.expect)(cells.nth(1)).toHaveText('O');
    });
    (0, test_1.test)('should win the game with three Xs in a row', async ({ page }) => {
        const cells = page.locator('.board-cell');
        await cells.nth(0).click(); // X
        await cells.nth(3).click(); // O
        await cells.nth(1).click(); // X
        await cells.nth(4).click(); // O
        await cells.nth(2).click(); // X wins
        const winMessage = await page.locator('.win-message'); // Adjust the selector as necessary
        await (0, test_1.expect)(winMessage).toBeVisible();
        await (0, test_1.expect)(winMessage).toHaveText(/X wins!/);
    });
    (0, test_1.test)('should end the game in a tie', async ({ page }) => {
        const cells = page.locator('.board-cell');
        await cells.nth(0).click(); // X
        await cells.nth(1).click(); // O
        await cells.nth(2).click(); // X
        await cells.nth(4).click(); // O
        await cells.nth(3).click(); // X
        await cells.nth(5).click(); // O
        await cells.nth(7).click(); // X
        await cells.nth(6).click(); // O
        await cells.nth(8).click(); // X
        const tieMessage = await page.locator('.tie-message'); // Adjust the selector as necessary
        await (0, test_1.expect)(tieMessage).toBeVisible();
        await (0, test_1.expect)(tieMessage).toHaveText(/It's a draw!/);
    });
    (0, test_1.test)('should reset the game', async ({ page }) => {
        const cells = page.locator('.board-cell');
        const resetButton = page.locator('#button-reset-zen'); // Adjust the selector as necessary
        await cells.nth(0).click(); // X
        await cells.nth(1).click(); // O
        await resetButton.click();
        for (let i = 0; i < 9; i++) {
            await (0, test_1.expect)(cells.nth(i)).toHaveText('');
        }
    });
});
