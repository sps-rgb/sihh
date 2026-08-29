/**
 * Formats a numeric amount in INR to a clean Indian currency string.
 * Examples:
 *   500000 -> "₹5 Lakh"
 *   2500000 -> "₹25 Lakh"
 *   150000 -> "₹1.5 Lakh"
 *   10000000 -> "₹1 Crore"
 *   50000 -> "₹50,000"
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
  if (amount <= 0) return '₹0';

  if (amount >= 10000000) {
    const crores = amount / 10000000;
    const formatted = crores % 1 === 0 ? crores.toString() : crores.toFixed(2).replace(/\.?0+$/, '');
    return `₹${formatted} Crore`;
  }

  if (amount >= 100000) {
    const lakhs = amount / 100000;
    const formatted = lakhs % 1 === 0 ? lakhs.toString() : lakhs.toFixed(2).replace(/\.?0+$/, '');
    return `₹${formatted} Lakh`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

