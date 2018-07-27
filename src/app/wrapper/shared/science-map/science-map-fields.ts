import { simpleField, access } from '@ngx-dino/core';

export const subdisciplineSizeField = simpleField<number>({
  bfieldId: 'size',
  label: 'Subdiscipline Size',

  operator: access('weight')
});

export const subdisciplineIdField = simpleField<number | string>({
  bfieldId: 'id',
  label: 'Subdiscipline Id',

  operator: access('subd_id')
});

export const tooltipTextField = simpleField<number | string>({
  bfieldId: 'tooltip',
  label: 'Subdiscipline Id',

  operator: access('subd_id')
});
