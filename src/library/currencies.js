export function insertCurrency(code, event) {
  if (!code) return
  const normalizedCode = code.trim().toUpperCase();
  if (!event.currencies) {
    event.currencies = [];
  }

  if (!event.currencies.some(c => c.code === normalizedCode)) {
    event.currencies.push({code: normalizedCode, unit: 1});
    return normalizedCode;
  }
}
