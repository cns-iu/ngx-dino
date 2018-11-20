import { DatumId, simpleField, access, constant } from '@ngx-dino/core';

export const nodeIdField = simpleField<DatumId>({
  label: 'Node Id',
  operator: access('id')
});

export const nodePositionField = simpleField<[number, number]>({
  label: 'Node Latitude/Longitude',
  operator: access('lat_long')
});

export const nodeSizeField = simpleField<number>({
  label: 'Node Size',
  operator: access('size')
});

export const nodeSymbolField = simpleField<any>({
  label: 'Node Symbol',
  operator: access('shape')
});

export const nodeColorField = simpleField<string>({
  label: 'Node Color',
  operator: access('size')
});

export const nodeStrokeColorField = simpleField<string>({
  label: 'Node Stroke Color',
  operator: access('stroke')
});

export const nodeStrokeWidthField = simpleField<undefined>({
  label: 'Node Stroke Width',
  operator: constant(undefined)
});

export const nodeTooltipField = simpleField<undefined>({
  label: 'Node Tooltip',
  operator: constant(undefined)
});

export const nodeLabelField = simpleField<string>({
  label: 'Node Label',
  operator: access('title')
});

export const nodeLabelPositionField = simpleField<undefined>({
  label: 'Node Label Position',
  operator: constant(undefined)
});

export const nodeTransparencyField = simpleField<undefined>({
  label: 'Node Transparency',
  operator: constant(undefined)
});

export const nodeStrokeTransparencyField = simpleField<undefined>({
  label: 'Node Stroke Transparency',
  operator: constant(undefined)
});

export const nodePulseField = simpleField<undefined>({
  label: 'Node Pulse',
  operator: constant(undefined)
});

// Old
export const stateField = simpleField<any>({
  label: 'State Id',
  operator: access('label')
});

export const stateColorField = simpleField<any>({
  label: 'State Color',
  operator: access('color')
});


export const pointIdField = simpleField<any>({
  label: 'Point Id',
  operator: access('id')
});

export const pointLatLongField = simpleField<any>({
  label: 'Point Latitude/Longitude',
  operator: access('lat_long')
});

export const pointSizeField = simpleField<any>({
  label: 'Point Size',
  operator: access('size')
});

export const pointColorField = simpleField<any>({
  label: 'Point Color',
  operator: access('size')
});

export const pointShapeField = simpleField<any>({
  label: 'Point Shape',
  operator: access('shape')
});

export const pointStrokeColorField = simpleField<any>({
  label: 'Point Stroke Color',
  operator: access('stroke')
});

export const pointTitleField = simpleField<any>({
  label: 'Point Title',
  operator: access('title')
});

export const pulseField = simpleField<boolean>({
  bfieldId: 'pulse',
  label: 'Pulse',

  operator: access('pulse', false)
});

export const stateColorCategoryField = simpleField<string>({
  bfieldId: 'stateColorCategory',
  label: 'State Color Category',

  operator: access('label', 'Unknown')
});

export const pointColorCategoryField = simpleField<number>({
  bfieldId: 'pointColorCategory',
  label: 'Point Color Category',

  operator: access('size', 0)
});
