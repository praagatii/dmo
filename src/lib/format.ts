/** Indian Rupee formatting. Prices in the menu data are whole rupees. */
export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
