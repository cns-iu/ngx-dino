import { Operator, simpleField } from '@ngx-dino/core';
import '@ngx-dino/core/src/v2/operators/add/common';

export const subdisciplineSizeField = simpleField<number>({
  bfieldId: 'size',
  label: 'Subdiscipline Size',

  operator: Operator.access('weight')
});

export const subdisciplineIDField = simpleField<number|string>({
  bfieldId: 'id',
  label: 'Subdiscipline Id',

  operator: Operator.access('subd_id')
});
