import { Operator } from '../../operators';
import { Field, BoundField } from '../base';


export function makeBoundField<T>(
  id: string, field: Field<T>, op: Operator<any, T>
): BoundField<T> {
  // Cast to get around private modifier
  return new (BoundField as any)(id, field, op);
}
