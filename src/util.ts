export function numPad(num: number, size: number): string {
  let s = num + '';
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
}

export function roundAt(num: number, decimal: number): number {
  const pow = Math.pow(10, decimal);
  return Math.round(num * pow) / pow;
}

export function interpolate(from: number[], to: number[], t: number): number[] {
  return from.map((v, i) => v + (to[i] - v) * t);
}