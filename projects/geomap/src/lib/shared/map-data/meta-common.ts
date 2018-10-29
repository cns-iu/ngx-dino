import { isArray, lowerCase } from 'lodash';

export type MetaSelector = number | string;
export namespace MetaSelector {
  export function normalize(selector: MetaSelector): string {
    return lowerCase(String(selector));
  }
}

export type MultiMetaSelector = MetaSelector | MetaSelector[];
export namespace MultiMetaSelector {
  export function normalize(selectors: MultiMetaSelector): string[] {
    const selectorArray = isArray(selectors) ? selectors : [selectors];
    return selectorArray.map(MetaSelector.normalize);
  }
}
