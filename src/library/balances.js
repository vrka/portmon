export function computeBalances(entries, members, currencies) {

  const nullRow = Object.fromEntries(members.map(n => [n, 0]));
  const balances = {};

  entries.forEach(entry => {
    const payers = entry.payers === null ? members : entry.payers;
    const receivers = entry.receivers === null ? members : entry.receivers;
    if (!payers.length || !receivers.length || !entry.currency || !entry.amount)
      return;
    const {curr, amount} = getEntrySpending(entry, currencies);
    ensureCurrency(balances, curr, nullRow);
    updateBalances(balances, curr, payers, -amount);
    updateBalances(balances, curr, receivers, amount);
  })
  return balances
}

function updateBalances(balances, curr, members, amount) {
  const amountSplit = amount / members.length;
  members.forEach(m => {
    balances[curr][m] += amountSplit;
  })
}

export function getEntrySpending(entry, currencies) {
  let amount = entry.amount;
  let curr = entry.currency;
  while (true) {
    const item = currencies.find(c => c.code === curr && c.ratio !== undefined);
    if (!item) break;
    amount *= item.reverse ? 1 / item.ratio : item.ratio;
    curr = item.base;
  }
  return {curr, amount};
}

function ensureCurrency(balances, code, nullRow) {
  if (!(code in balances))
    balances[code] = {...nullRow};
}

export function unit2params(unit) {
  const safeUnit = Number(unit ?? 1);
  return {
    unit: safeUnit,
    decimals: unit >= 1 ? 0 : Math.round(-Math.log10(unit))
  };
}

export function formatValue(value, params) {
  console.log("formatting", value, params);
  const unit = params.unit;
  const rounded = Math.round(value / unit) * unit;

  let [intPart, decPart] = rounded.toFixed(params.decimals).split('.');
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Combine back; skip decimal if decimals is 0
  return decPart ? `${intPart}.${decPart}` : intPart;
}
