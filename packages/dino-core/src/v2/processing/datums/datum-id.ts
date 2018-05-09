import { isNumber, isString } from 'lodash';

import { BoundField } from '../../fields';


// Id type
export type DatumId = number | string;


export function isDatumId(obj: any): obj is DatumId {
  return isNumber(obj) || isString(obj);
}

export function extractId<T>(
  obj: DatumId | T, bfield: BoundField<DatumId>
): DatumId {
  return isDatumId(obj) ? obj : bfield.get(obj);
}
