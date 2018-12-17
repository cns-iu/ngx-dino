import { access, constant, simpleField } from '@ngx-dino/core';


export const barIdField = simpleField({
  label: 'Bar Id',
  operator: access('id')
});

export const barStartField = simpleField({
  label: 'Bar Start',
  operator: access('start')
});

export const barEndField = simpleField({
  label: 'Bar End',
  operator: access('end')
});

export const barWeightField = simpleField({
  label: 'Bar Weight',
  operator: access('weight')
});
