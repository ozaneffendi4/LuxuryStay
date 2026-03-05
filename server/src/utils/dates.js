export function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const ms = b.getTime() - a.getTime();
  const nights = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(0, nights);
}

// overlap if (start1 < end2) && (start2 < end1)
export function rangesOverlap(start1, end1, start2, end2) {
  return new Date(start1) < new Date(end2) && new Date(start2) < new Date(end1);
}