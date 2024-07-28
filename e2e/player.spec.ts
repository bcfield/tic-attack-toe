import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Open page
  await page.goto('http://127.0.0.1:5500');

  // Click on the begin button
  await page.click('#button-begin');
});

test('Should limit player 1 name to 16 characters', async ({ page }) => {
  // Enter 17 character player 1 name
  await page.waitForTimeout(600);
  await page.fill('#player1-name-input', '12345678901234567');

  // Verify player 1 name is 16 characters.
  const playerName = await page.inputValue('#player1-name-input');
  expect(playerName.length).toBe(16);
});

test('Should limit player 2 name to 16 characters', async ({ page }) => {
  // Enter player 1 details after animation
  await page.waitForTimeout(600);
  await page.fill('#player1-name-input', 'Player 1');
  await page.click('#player1-colors .color-circle.bg-plum');
  
  // Enter 17 character player 2 name
  await page.waitForTimeout(600);
  await page.fill('#player2-name-input', '12345678901234567');

  // Verify player 1 name is 16 characters.
  const playerName = await page.inputValue('#player2-name-input');
  expect(playerName.length).toBe(16);
});

test('Should leave continue button disabled if player 1 name is empty', async ({ page }) => {
  // Select player 1 color
  await page.waitForTimeout(600);
  await page.click('#player1-colors .color-circle.bg-plum');

  // Verify button remains disabled
  await expect(page.locator('#button-next-player1')).toBeDisabled();
});

test('Should leave continue button disabled if player 2 name is empty', async ({ page }) => {
  // Enter player 1 details after animation
  await page.waitForTimeout(600);
  await page.fill('#player1-name-input', 'Player 1');
  await page.click('#player1-colors .color-circle.bg-plum');
  
  // Select player 2 color
  await page.waitForTimeout(600);
  await page.click('#player2-colors .color-circle.bg-peach');

  // Verify button remains disabled
  await expect(page.locator('#button-next-player2')).toBeDisabled();
});

test('Should enter player details and move to game mode screen (name then color)', async ({ page }) => {
  // Enter player 1 details after animation
  await page.waitForTimeout(600);
  await page.fill('#player1-name-input', 'Player 1');
  await page.click('#player1-colors .color-circle.bg-plum');

  // Enter player 2 details after animation
  await page.waitForTimeout(600);
  await page.fill('#player2-name-input', 'Player 2');
  await page.click('#player2-colors .color-circle.bg-peach');

  // Verify the transition to game mode screen
  await expect(page.locator('#button-start-zen')).toBeVisible();
  await expect(page.locator('#button-start-battle')).toBeVisible();
});

test('Should enter player details and move to game mode screen (color then name)', async ({ page }) => {
  // Enter player 1 details after animation
  await page.waitForTimeout(600);
  await page.click('#player1-colors .color-circle.bg-plum');
  await page.fill('#player1-name-input', 'Player 1');
  await page.waitForTimeout(600);
  await page.click('#button-next-player1');

  // Enter player 2 details after animation
  await page.waitForTimeout(600);
  await page.click('#player2-colors .color-circle.bg-peach');
  await page.fill('#player2-name-input', 'Player 2');
  await page.waitForTimeout(600);
  await page.click('#button-next-player2');

  // Verify the transition to game mode screen
  await expect(page.locator('#button-start-zen')).toBeVisible();
  await expect(page.locator('#button-start-battle')).toBeVisible();
});

test('Should select game mode and proceed to countdown', async ({ page }) => {
  // Enter player 1 details after animation
  await page.waitForTimeout(600);
  await page.fill('#player1-name-input', 'Player 1');
  await page.click('#player1-colors .color-circle.bg-plum');

  // Enter player 2 details after animation
  await page.waitForTimeout(600);
  await page.fill('#player2-name-input', 'Player 2');
  await page.click('#player2-colors .color-circle.bg-peach');

  // Select zen mode
  await page.waitForTimeout(600);
  await page.click('#button-start-zen');

  // Verify the transition to countdown screen
  await expect(page.locator('#countdown-timer')).toBeVisible();
});
