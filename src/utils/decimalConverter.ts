/**
 * Converts a Prisma Decimal or any value to a number
 * Handles Decimal types, strings, and numbers
 */
export const toNumber = (value: unknown): number => {
  if (value === null || value === undefined) {
    return 0
  }

  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }

  // Handle Prisma Decimal type
  if (typeof value === 'object' && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber()
  }

  return 0
}

/**
 * Formats a number with 2 decimal places
 */
export const formatCurrency = (value: unknown): string => {
  const num = toNumber(value)
  return `$${num.toFixed(2)}`
}
