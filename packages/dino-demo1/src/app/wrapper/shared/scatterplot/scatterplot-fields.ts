import { Operator, simpleField } from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/common';

// not user facing
export const pointIdField = simpleField<string>({
  bfieldId: 'id',
  label: 'Race ID',

  operator: Operator.access('id')
});

export const xField = simpleField<number>({
  bfieldId: 'x',
  label: 'X',

  operator: Operator.access('x')
});

export const yField = simpleField<number>({
  bfieldId: 'y',
  label: 'Y',

  operator: Operator.access('y')
});

export const colorField = simpleField<string>({
  bfieldId: 'color',
  label: 'Color',

  operator: Operator.access('color')
});

export const shapeField = simpleField<string>({
  bfieldId: 'shape',
  label: 'Shape',

  operator: Operator.access('shape')
});

export const sizeField = simpleField<number>({
  bfieldId: 'size',
  label: 'Size',

  operator: Operator.access('size')
});


export const strokeField = simpleField<string>({
  bfieldId: 'stroke',
  label: 'Stroke',

  operator: Operator.access('stroke')
});

export const tooltipTextField = simpleField<number>({
  bfieldId: 'tooltipText',
  label: 'Tooltip Text',

  operator: Operator.access('id')
});
