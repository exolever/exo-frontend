export function removeUnderscore(text): string {
  return text.replace(/_/g, ' ');
}

export function applyUnderscore(text): string {
  return text.replace(/ /g, '_');
}
