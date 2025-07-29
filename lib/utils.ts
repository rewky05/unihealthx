import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Philippine peso with proper formatting
 * @param amount - The amount in pesos
 * @returns Formatted string like "₱2,500.00"
 */
export function formatPhilippinePeso(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) {
    return 'Not specified';
  }
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}
