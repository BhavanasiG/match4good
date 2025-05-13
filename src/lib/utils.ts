import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 *
 * @param {ClassValue[]} inputs - Array of class names
 * @returns {string} - Merged class names
 */
export function Cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
