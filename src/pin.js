export function normalizePin(value = "") {
  return String(value).trim();
}

export function isPinValid(input, expected) {
  const a = normalizePin(input);
  const b = normalizePin(expected);
  return a.length >= 4 && a === b;
}
