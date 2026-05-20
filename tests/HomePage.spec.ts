import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display initial page with add day button', async ({ page }) => {
    await expect(page).toHaveTitle('Workout log');

    await expect(page.getByRole('button', { name: 'Add day' })).toBeVisible();
  });

  test('should create days list with all weekdays', async ({ page }) => {
    await page.getByRole('button', { name: 'Add day' }).click();

    await expect(page.getByTestId('days list')).toBeVisible();
    await expect(page.getByTestId('day item')).toContainText(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
  });

  test('should remove day from the list after selecting it as a training', async ({ page }) => {
    await page.getByRole('button', { name: 'Add day' }).click();

    await page.getByTestId('day item').getByText('monday', { exact: true }).click();
    await expect(page.getByTestId('days list')).toBeHidden();

    await page.getByRole('button', { name: 'Add day' }).click();
    await expect(page.getByTestId('days list')).toBeVisible();

    await expect(page.getByTestId('day item').getByText('monday', { exact: true })).not.toBeVisible();
  });

  test('should navigate to training day and delete it', async ({ page }) => {
    // Setup: Create days list and remove monday
    await page.getByRole('button', { name: 'Add day' }).click();
    await page.getByTestId('day item').getByText('monday', { exact: true }).click();
    await page.getByRole('button', { name: 'Add day' }).click();
    await expect(page.getByTestId('days list')).toBeVisible();

    await expect(page.getByTestId('day item').getByText('monday', { exact: true })).not.toBeVisible();

    // Navigate to monday training
    await page.getByRole('link', { name: 'monday' }).click();
    await expect(page).toHaveURL(/\/monday$/);

    // Delete and verify return home
    await page.getByTestId('delete day btn').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId('days list')).toBeVisible();
  });
});
