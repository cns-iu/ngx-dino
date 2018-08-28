import { BoundField, access, simpleField } from '@ngx-dino/core';

export type FieldNames =
  'nodeIdField' | 'nodePositionField' | 'nodeSizeField' |
  'edgeIdField' | 'edgeSourceField' | 'edgeTargetField' ;
export type Fields = {[P in FieldNames]?: BoundField<any>};


export const nodeIdField = simpleField({
  bfieldId: 'id',
  label: 'Node Id',
  operator: access('id')
});

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


export const edgeIdField = simpleField({
  bfieldId: 'id',
  label: 'Edge Id',
  operator: access('id')
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
