import { Operator, simpleField } from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/common';

export const subdisciplineSizeField = simpleField<number>({
  bfieldId: 'size',
  label: 'Subdiscipline Size',

  operator: Operator.access('weight')
});

export const subdisciplineIdField = simpleField<number | string>({
  bfieldId: 'id',
  label: 'Subdiscipline Id',

  operator: Operator.access('subd_id')
});

export const tooltipTextField = simpleField<number | string>({
  bfieldId: 'tooltip',
  label: 'Subdiscipline Id',

  operator: Operator.access('subd_id')
});
