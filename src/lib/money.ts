/**
 * Converts an amount in pence to pounds.
 *
 * @param amount - The amount in pence to convert.
 * @returns The equivalent amount in pounds.
 *
 * @example
 * ```ts
 * toPounds(100); // returns 1
 * toPounds(250); // returns 2.5
 * ```
 */
export const toPounds = (amount: number) => amount / 100;

/**
 * Converts a monetary value in pounds to pence by multiplying by 100 and
 * rounding to the nearest whole number.
 *
 * @param amount - The amount in pounds.
 * @returns The equivalent amount in pence as an integer.
 */
export const fromPounds = (amount: number) => Math.round(amount * 100);

/**
 * Formats an amount in pence as a string with two decimal places.
 *
 * @param amount - The amount in pence.
 * @returns The formatted amount as a string.
 */
export const formatAmount = (amount: number) => toPounds(amount).toFixed(2);

/**
 * Formats an amount in pence as a GBP currency string.
 *
 * @param amount - The amount in pence to format as currency.
 * @returns A string representation of the amount prefixed with the GBP symbol
 * (£).
 * @example
 * formatCurrency(1050); // Returns "£10.50"
 */
export const formatCurrency = (amount: number) => `£${formatAmount(amount)}`;

/**
 * Formats an amount in pence as a signed GBP currency string.
 *
 * Negative amounts are prefixed with a `-` sign, while positive amounts
 * are formatted without a sign prefix.
 *
 * @param amount - The amount in pence to format as signed currency.
 * @returns A signed currency string representation of the amount.
 *
 * @example
 * formatCurrencySigned(-1050); // Returns '-£10.50'
 * formatCurrencySigned(1050);  // Returns '£10.50'
 */

export const formatCurrencySigned = (amount: number) =>
    `${amount < 0 ? '-' : ''}${formatCurrency(Math.abs(amount))}`;

/**
 * Returns a color based on the balance amount.
 *
 * @param amount - The balance amount.
 * @returns The color representing the balance.
 */
export const getBalanceColor = (amount: number) => {
    if (amount < 0) return 'red';
    if (amount > 0) return 'teal';
    return 'dimmed';
};
