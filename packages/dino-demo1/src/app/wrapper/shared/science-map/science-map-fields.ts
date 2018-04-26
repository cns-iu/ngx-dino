import { Operator, SimpleField } from '@ngx-dino/core';
import '@ngx-dino/core/src/v2/operators/add/common';

export const subdisciplineSizeField = new SimpleField<number>({
  defaultId: 'size',
  label: 'Subdiscipline Size',

  operator: Operator.access('weight')
});

export const subdisciplineIDField = new SimpleField<number|string>({
  defaultId: 'id',
  label: 'Subdiscipline Id',

  operator: Operator.access('subd_id')
});
