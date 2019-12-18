/**
 * Capitalize first letter from a string
 *
 * Example: capitalize will return Capitalize.
 * @param string
 * @returns {any}
 */
export const capitalize = (string) => string.replace(/\b\w/g, l => l.toUpperCase());
