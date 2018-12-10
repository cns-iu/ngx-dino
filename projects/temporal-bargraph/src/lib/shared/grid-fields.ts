import {
  DatumId, Field,
  access as accessOp, constant as constantOp, simpleField
} from '@ngx-dino/core';

export const gridIdField: Field<DatumId> = simpleField({
  label: 'Grid Line Id',
  operator: accessOp('id')
});

export const gridStrokeColorField: Field<string> = simpleField({
  label: 'Grid Line Color',
  operator: constantOp('#E0E0E0')
});

export const gridStrokeWidthField: Field<number> = simpleField({
  label: 'Grid Line Width',
  operator: constantOp(1)
});

export const gridTransparencyField: Field<number> = simpleField({
  label: 'Grid Line Transparency',
  operator: constantOp(0)
});
