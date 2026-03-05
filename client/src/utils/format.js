export function money(amount, currency = "PKR") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function isoDate(d) {
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10);
}