import { BoundField, constant as constantOp, map as mapOp, simpleField } from '@ngx-dino/core';

let counter = 0;
export const defaultStackOrderField = simpleField({
  label: 'Default Stack Order',
  operator: mapOp(() => counter++)
}).getBoundField();

export function createDefaultField<T>(value: T): BoundField<T> {
  const field = simpleField({ label: 'Default', operator: constantOp(value) });
  return field.getBoundField();
}
