import { BoundField, access, simpleField } from '@ngx-dino/core';

export type FieldNames =
  'nodePositionField' | 'nodeSizeField' |
  'edgeSourceField' | 'edgeTargetField' ;
export type Fields = {[P in FieldNames]?: BoundField<any>};


export const nodePositionField = simpleField({
  bfieldId: 'position',
  label: 'Node Position',
  operator: access('position')
});

export const nodeSizeField = simpleField({
  bfieldId: 'size',
  label: 'Node Size',
  operator: access('size')
});


export const edgeSourceField = simpleField({
  bfieldId: 'source',
  label: 'Edge Source Position',
  operator: access('source')
});

export const edgeTargetField = simpleField({
  bfieldId: 'target',
  label: 'Edge Target Position',
  operator: access('target')
});
