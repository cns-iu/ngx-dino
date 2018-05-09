import { Seq } from 'immutable';


export function stringCompare(s1: string, s2: string): number {
  if (s1 < s2) {
    return -1;
  }  else if (s1 > s2) {
    return 1;
  } else {
    return 0;
  }
}

export function numberCompare(n1: number, n2: number): number {
  const diff = n1 - n2;
  if (diff === 0) {
    // +0 and -0
    const n1pos = +((1 / n1) === Infinity);
    const n2pos = +((1 / n2) === Infinity);
    return n1pos - n2pos;
  } else if (diff !== diff) {
    // NaNs
    const n1Nan = n1 !== n1;
    const n2Nan = n2 !== n2;
    return n1Nan ? +(!n2Nan) : -1;
  } else {
    return diff;
  }
}


export function toStringHelper(
  name: string,
  keywords: Seq<string, any> | Iterable<[string, any]> = [],
  values: Seq.Indexed<any> | Iterable<any> = []
): string {
  const kwString = Seq.Indexed<[string, any]>(keywords).map(([key, data]) => {
    return `${key}: ${data}`;
  }).join('|');
  const valueString = Seq.Indexed<any>(values).map((val) => {
    return '' + val;
  }).join('|');
  const contentString = [kwString, valueString].filter((s) => s).join('|');

  return `${name}<${contentString}>`;
}
