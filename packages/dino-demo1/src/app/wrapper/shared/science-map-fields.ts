import { Operator } from '@ngx-dino/core/operators';
import { FieldV2 as Field}  from '@ngx-dino/core';


export const subdisciplineSizeField = new Field<string>({
  id: '1',
  label: 'Subdiscipline Size',

  initialOp: Operator.access('tableData'),
  mapping: [
    ['size', true]
  ]
});

export const subdisciplineIDField = new Field<number|string>({
  id: '1',
  label: 'Subdiscipline ID',

  initialOp: Operator.access('subd_id'),
  mapping: [
    ['id', true]
  ]
});

