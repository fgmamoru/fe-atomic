import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3000';

test('do switch', async ({ page }) => {
    await page.goto(URL);

    // Expect a title "to contain" a substring.
    await expect(page.getByTestId('main-title')).toHaveText(/Get Ton/);
    await expect(page.getByTestId("stake-switch-button__stake")).toHaveText(/Stake/);
    await expect(page.getByTestId("stake-switch-button__unstake")).toHaveText(/Unstake/);

    await expect(page.getByLabel(/You Unstake/)).not.toBeVisible();
    await expect(page.getByLabel(/You Stake/)).toBeVisible();

    await page.getByTestId("stake-switch-button__unstake").click();
    await expect(page.getByLabel(/You Unstake/)).toBeVisible();
    await expect(page.getByLabel(/You Stake/)).not.toBeVisible();
});

test('stake - open connect wallet', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByLabel(/You Stake/)).toBeVisible();
    await expect(page.getByLabel(/You Receive/)).toBeVisible();
    await expect(page.getByText(/1 Ton/)).toBeVisible();
    await expect(page.getByText(/TVL/)).toBeVisible();
    await expect(page.getByText(/Max/)).toBeVisible();

    await expect(page.getByTestId("stake-button")).toBeVisible()
    await expect(page.getByTestId("stake-button")).toHaveText(/Connect Wallet/);
    await page.getByTestId("stake-button").click();

    await expect(page.getByRole("dialog")).toHaveText(/What is a Wallet/);
});