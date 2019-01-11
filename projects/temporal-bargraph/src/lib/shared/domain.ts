import { head, last, range, reduce } from 'lodash';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function interpolateNumericDomain(domain: number[]): number[] {
  if (domain.length < 3) {
    return domain;
  }

  const diffs: number[] = [];
  void(reduce(domain, (prev, curr) => (diffs.push(curr - prev), curr)));

  const start = head(domain);
  const end = last(domain);
  const step = reduce(diffs, gcd);

  // Temporary fix to handle huge domains
  if ((end - start) / step > 50) {
    return domain;
  }

  return range(start, end + step, step);
}
