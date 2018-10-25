import { isArray, lowerCase } from 'lodash';

export type Selector = number | string;
export type MultiSelector = Selector | Selector[];

export function normalizeSelector(selector: Selector): string {
  return lowerCase(String(selector));
}

export function normalizeMultiSelector(selectors: MultiSelector): string[] {
  const selectorArray = isArray(selectors) ? selectors : [selectors];
  return selectorArray.map(normalizeSelector);
}
