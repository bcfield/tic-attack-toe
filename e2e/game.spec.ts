import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Open page
  await page.goto('http://127.0.0.1:5500');

  // Click on the begin button
  await page.click('#button-begin');

  // Enter player 1 details after animation
  await page.waitForTimeout(1200);
  await page.fill('#player1-name-input', 'Player 1');
  await page.click('#player1-colors .color-circle.bg-plum');

  // Enter player 2 details after animation
  await page.waitForTimeout(1200);
  await page.fill('#player2-name-input', 'Player 2');
  await page.click('#player2-colors .color-circle.bg-peach');

  // Select zen mode
  await page.waitForTimeout(1200);
  await page.click('#button-start-zen');

  // Wait for countdown to complete after animation
  await page.waitForTimeout(6200);
});

test('Should place an X or O in the block', async ({ page }) => {
  const cells = page.locator('.board-cell');

  // Detect which player was randomly selected to go first
  await cells.nth(0).click();
  const firstSymbol = (await cells.nth(0).textContent())!;
  const secondSymbol = firstSymbol === 'X' ? 'O' : 'X';

  // Confirm symbol of second move
  await cells.nth(1).click();
  await expect(cells.nth(1)).toHaveText(secondSymbol);

  // Confirm symbol of third move
  await cells.nth(2).click();
  await expect(cells.nth(2)).toHaveText(firstSymbol);
});

test('Should identify a winner', async ({ page }) => {
  const cells = page.locator('.board-cell');

  // Detect which player was randomly selected to go first
  await cells.nth(0).click();
  const firstSymbol = (await cells.nth(0).textContent())!;
  const secondSymbol = firstSymbol === 'X' ? 'O' : 'X';

  // Play a winning game scenario
  await cells.nth(3).click();
  await cells.nth(1).click();
  await cells.nth(4).click();
  await cells.nth(2).click();

  // Check winner text based on the first symbol placed
  const winner = firstSymbol === 'X' ? 'Player 1' : 'Player 2';
  await expect(page.locator('#turn-indicator')).toHaveText(`${winner} wins!`);
});

test('Should identify a draw', async ({ page }) => {
  const cells = page.locator('.board-cell');

  // Play a draw scenario
  await cells.nth(0).click();
  await cells.nth(1).click();
  await cells.nth(2).click();
  await cells.nth(4).click();
  await cells.nth(3).click();
  await cells.nth(5).click();
  await cells.nth(7).click();
  await cells.nth(6).click();
  await cells.nth(8).click();
  
  // Check draw text is displayed
  await expect(page.locator('#turn-indicator')).toHaveText("It's a draw!");
});

test('Should reset the game', async ({ page }) => {
  const cells = page.locator('.board-cell');
  const resetButton = page.locator('#button-reset-zen');

  // Play two moves
  await cells.nth(0).click();
  await cells.nth(1).click();

  // Click on the reset button
  await resetButton.click();

  // Check played cells are empty
  await expect(cells.nth(0)).toHaveText('');
  await expect(cells.nth(1)).toHaveText('');
});

test('Should handle keybindings correctly', async ({ page }) => {
  const cells = page.locator('.board-cell');

  await cells.nth(0).click();
  const firstSymbol = (await cells.nth(0).textContent())!;
  const secondSymbol = firstSymbol === 'X' ? 'O' : 'X';

  if (firstSymbol === 'X') {
    // Confirm symbol of second move
    await page.keyboard.press('o');
    await expect(cells.nth(1)).toHaveText(secondSymbol);
    // Confirm symbol of third move
    await page.keyboard.press('e');
    await expect(cells.nth(2)).toHaveText(firstSymbol);
  } else {
    await page.keyboard.press('w');
    await expect(cells.nth(1)).toHaveText(secondSymbol);
    // Confirm symbol of third move
    await page.keyboard.press('p');
    await expect(cells.nth(2)).toHaveText(firstSymbol);
  }
});

test('Should ensure players cannot make moves for each other', async ({ page }) => {
  const cells = page.locator('.board-cell');

  // Detect which player was randomly selected to go first
  await cells.nth(0).click();
  const firstSymbol = (await cells.nth(0).textContent())!;
  const secondSymbol = firstSymbol === 'X' ? 'O' : 'X';

  if (firstSymbol === 'X') {
    // Confirm player 1 false click
    await page.keyboard.press('w');
    await expect(cells.nth(1)).toHaveText('');

    // Player 2 true click
    await page.keyboard.press('o');

    // Confirm player 2 false click
    await page.keyboard.press('p');
    await expect(cells.nth(2)).toHaveText('');
  } else {
    // Confirm player 2 false click
    await page.keyboard.press('o');
    await expect(cells.nth(1)).toHaveText('');

    // Player 1 true click
    await page.keyboard.press('w');

    // Confirm player 1 false click
    await page.keyboard.press('e');
    await expect(cells.nth(2)).toHaveText('');
  }
});

test('Should ensure symbols cannot be placed after a game is complete', async ({ page }) => {
  const cells = page.locator('.board-cell');

  // Detect which player was randomly selected to go first
  await cells.nth(0).click();
  const firstSymbol = (await cells.nth(0).textContent())!;
  const secondSymbol = firstSymbol === 'X' ? 'O' : 'X';

  // Play a winning game scenario
  await cells.nth(3).click();
  await cells.nth(1).click();
  await cells.nth(4).click();
  await cells.nth(2).click();

  // Check placement in empty cell remains empty
  await cells.nth(5).click();
  await expect(cells.nth(5)).toHaveText('');
});
