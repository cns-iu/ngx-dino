import { BoundField, access, constant, simpleField } from '@ngx-dino/core';

export type FieldNames =
  'nodeIdField' | 'nodePositionField' | 'nodeXField' | 'nodeYField' | 'nodeSizeField' | 'nodeSymbolField' |
  'nodeColorField' | 'nodeStrokeField' | 'nodeStrokeWidthField' | 'nodeTooltipField' | 'nodeLabelField' |
  'nodeLabelPositionField' | 'edgeIdField' | 'edgeSourceField' | 'edgeSourceXField' | 'edgeSourceYField' |
  'edgeTargetField' | 'edgeTargetXField' | 'edgeTargetYField' | 'edgeStrokeField' | 'edgeStrokeWidthField' |
  'edgeTransparencyField' | 'nodeTransparencyField' | 'strokeTransparencyField' | 'nodePulseField';
export type Fields = {[P in FieldNames]?: BoundField<any>};


export const nodeIdField = simpleField({
  bfieldId: 'id',
  label: 'Node Id',
  operator: access('id')
});

export const nodePositionField = simpleField({
  bfieldId: 'position',
  label: 'Node Position',
  operator: constant(undefined)
});

export const nodeXField = simpleField({
  bfieldId: 'x',
  label: 'X Position',
  operator: access('position[0]')
});

export const nodeYField = simpleField({
  bfieldId: 'y',
  label: 'Y Position',
  operator: access('position[1]')
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

export const nodeStrokeField = simpleField({
  bfieldId: 'node-stroke',
  label: 'Node Stroke',
  operator: access('nodeStroke')
});
export const nodeStrokeWidthField = simpleField({
  bfieldId: 'stroke',
  label: 'Node Stroke',
  operator: access('strokeWidth', 5)
});

export const nodeTooltipField = simpleField({
  bfieldId: 'tooltip',
  label: 'Node Tooltip',
  operator: access('nodeTooltip')
});

export const nodeLabelField = simpleField({
  bfieldId: 'label',
  label: 'Node Label',
  operator: access('nodeLabel')
});

export const nodeLabelPositionField = simpleField({
  bfieldId: 'label-position',
  label: 'Node Label Position',
  operator: access('nodeLabelPosition')
});

export const nodePulseField = simpleField({
  label: 'Node Label Position',
  operator: constant(undefined)
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

export const edgeTransparencyField = simpleField({
  bfieldId: 'transparency',
  label: 'Edge Transparency',
  operator: access('transparency', 1)
});

export const nodeTransparencyField = simpleField({
  bfieldId: 'transparency',
  label: 'Node Transparency',
  operator: access('nodeTransparency', 1)
});

export const strokeTransparencyField = simpleField({
  bfieldId: 'stroke-transparency',
  label: 'Stroke Transparency',
  operator: access('strokeTransparency', 1)
});
