import { isArray, isNaN, isNumber } from 'lodash';

/**
 * A feature selector is an array of 1 or more identifiers (numbers or strings).
 * All strings are case insensitive.
 * [0] -> Must be the string 'world'.
 * [1] -> Can be 'land', 'countries', or a specific country identifier i.e. 'Sweden', 'United States' <-> 'USA' <-> 840.
 * [2] -> If [1] === 'USA', can be 'states' or a specific state identifier i.e. 'Indiana' <-> 18.
 * [3] -> If [1] === 'USA' and [2] !== 'states', can be 'counties' or a specific county identifier i.e. 'Monroe' <-> 18105.
 */
export type FeatureSelector = (number | string)[];
export namespace FeatureSelector {
  export function normalize(selector: FeatureSelector): FeatureSelector {
    return selector.map(segment => {
      const asNumber = Number(segment);
      return isNumber(segment) || !isNaN(asNumber) ? asNumber : segment.toLowerCase().normalize();
    });
  }
}

export type MultiFeatureSelector = FeatureSelector | FeatureSelector[];
export namespace MultiFeatureSelector {
  export function normalize(selectors: MultiFeatureSelector): FeatureSelector[] {
    if (selectors.length === 0) {
      return [];
    } else if (isArray(selectors[0])) { // Array of FeatureSelectors
      return (selectors as FeatureSelector[]).map(FeatureSelector.normalize);
    } else { // Single FeatureSelector
      return [FeatureSelector.normalize(selectors as FeatureSelector)];
    }
  }
}
