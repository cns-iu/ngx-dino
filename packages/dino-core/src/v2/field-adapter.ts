// Turns a v2 field into a v1 ifield

import { IField } from '../shared/field';
import { BoundField } from './field';


export class BoundFieldAdapter<T> implements IField<T> {
  constructor(readonly bfield: BoundField<T>) { }

  get name(): string {
    return this.bfield.field.id;
  }

  get label(): string {
    return this.bfield.field.label;
  }

  get datatype(): string {
    return this.bfield.field.datatype;
  }

  get(item: any): T {
    return this.bfield.get(item);
  }
}


export function adaptBoundField<T>(bfield: BoundField<T>): BoundFieldAdapter<T> {
  return new BoundFieldAdapter(bfield);
}
