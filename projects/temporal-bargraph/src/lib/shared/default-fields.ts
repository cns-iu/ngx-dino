import { BoundField, constant as constantOp, simpleField } from '@ngx-dino/core';

export function createDefaultField<T>(value: T): BoundField<T> {
  const field = simpleField({ label: 'Default', operator: constantOp(value) });
  return field.getBoundField();
}
