import { transformDateToUserFriendly } from '@/shared/lib/helpers/transformDateToUserFriendly';
import { test, expect } from '@playwright/test';

test.describe('Exercise page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should add Calf raises exercise to Monday training day, add row with timestamp, enter values and delete row', async ({ page }) => {
    await page.getByRole('button', { name: 'Add day' }).click();
    await page.getByText('monday').click();
    await page.getByTestId('training day').click();
    await page.getByRole('button', { name: 'Add exercise' }).click();
    await page.getByText('Calf raises').click();
    await expect(page.getByRole('cell', { name: 'No data No data' })).toBeVisible();
    await page.getByRole('button', { name: 'Add a row' }).click();
    const date = transformDateToUserFriendly(new Date().toString());

    await expect(page.getByRole('cell', { name: date })).toBeVisible();
    await page.getByText('0').nth(1).click();
    await page.getByRole('textbox', { name: '0' }).fill('1');
    await page.getByRole('textbox', { name: '0' }).press('Enter');
    await expect(page.getByRole('table').getByText('1', { exact: true })).toBeVisible();
    await page.getByRole('textbox', { name: '0' }).fill('2');
    await page.getByRole('textbox', { name: '0' }).press('Enter');
    await expect(page.getByRole('table').getByText('2', { exact: true })).toBeVisible();
    await page.getByRole('textbox', { name: '0' }).fill('3');
    await page.getByRole('textbox', { name: '0' }).press('Enter');
    await expect(page.getByRole('table').getByText('3', { exact: true })).toBeVisible();
    await page
      .getByRole('row', { name: `${date} 1 2 3 delete` })
      .getByRole('button')
      .click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.getByRole('cell', { name: 'No data No data' })).toBeVisible();
  });

  test('should behave correctly when a cell lose focus', async ({ page }) => {
    await page.getByRole('button', { name: 'Add day' }).click();
    await page.getByText('monday').click();
    await page.getByTestId('training day').click();
    await page.getByRole('button', { name: 'Add exercise' }).click();
    await page.getByText('Calf raises').click();
    await page.getByRole('button', { name: 'Add a row' }).click();
    await page.getByText('0').nth(1).click();
    await page.waitForTimeout(1000);
    await page.getByRole('textbox', { name: '0' }).fill('1');
    await page.getByRole('textbox', { name: '0' }).press('Enter');
    await page.getByText('1mondayAdd exerciseCalf').click();
    await page.getByRole('table').getByText('1', { exact: true }).click();
    await page.getByRole('textbox', { name: '0' }).fill('2');
    await page.getByRole('textbox', { name: '0' }).press('Enter');
    await page.getByRole('textbox', { name: '0' }).press('Enter');
    await page.getByText('0').nth(1).click();
    await page.getByRole('textbox', { name: '0' }).fill('4');
    await page.getByRole('textbox', { name: '0' }).press('Enter');
    await page.getByText('1mondayAdd exerciseCalf').click();
    await page.getByRole('table').getByRole('cell', { name: '0', exact: true }).click();
    await page.getByRole('textbox', { name: '0' }).fill('2');
    await page.getByRole('textbox', { name: '0' }).press('Enter');
  });
});
