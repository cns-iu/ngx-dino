import { BoundField, access, simpleField } from '@ngx-dino/core';

export type FieldNames =
  'nodeIdField' | 'nodePositionField' | 'nodeSizeField' | 'nodeSymbolField' | 'nodeColorField' |
  'edgeIdField' | 'edgeSourceField' | 'edgeTargetField' | 'edgeStrokeField' | 'edgeStrokeWidthField';
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

export const nodeSymbolField = simpleField({
  bfieldId: 'symbol',
  label: 'Node Symbol',
  operator: access('symbol', 'square')
});

export const nodeColorField = simpleField({
  bfieldId: 'color',
  label: 'Node Color',
  operator: access('color', 'blue')
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

export const edgeStrokeField = simpleField({
  bfieldId: 'stroke',
  label: 'Edge Stroke',
  operator: access('stroke', 'black')
});

export const edgeStrokeWidthField = simpleField({
  bfieldId: 'stroke-width',
  label: 'Edge Stroke Width',
  operator: access('strokeWidth', 5)
});
