import { transformDateToUserFriendly } from '@/shared/lib/helpers/transformDateToUserFriendly';
import { test, expect } from '@playwright/test';

test.describe('Exercise page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should behave correctly when a cell lose focus', async ({ page }) => {
    await page.getByRole('button', { name: 'Add day' }).click();
    await page.getByText('monday').click();
    await page.getByTestId('training day').click();
    await page.getByRole('button', { name: 'Add exercise' }).click();
    await page.getByText('Calf raises').click();
    await page.getByRole('button', { name: 'Add a row' }).click();
    await page.getByText('0').nth(1).click();
    await page.getByRole('textbox', { name: '0' }).fill('1');
    await page.getByRole('textbox', { name: '0' }).press('Enter');
    await expect(page.getByRole('table').getByText('1', { exact: true })).toBeVisible();

    await page.getByText('1mondayAdd exerciseCalf').click();
    await page.waitForTimeout(100);
    await page.getByRole('table').getByText('1', { exact: true }).click();
    await page.getByText('0').nth(1).click();

    await page.keyboard.type('2');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(100);
    await expect(page.getByRole('table').getByText('2', { exact: true })).toBeVisible();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    await page.getByText('0').nth(1).click();
    await page.getByRole('textbox', { name: '0' }).fill('4');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('table').getByText('4', { exact: true })).toBeVisible();

    await page.getByText('1mondayAdd exerciseCalf').click();
    await page.getByRole('table').getByRole('cell', { name: '4', exact: true }).click();

    await page.keyboard.type('2');

    await page.keyboard.press('Enter');
    await expect(page.getByRole('table').getByText('42', { exact: true })).toBeVisible();
  });
});
