import { access, constant, simpleField } from '@ngx-dino/core';


export const barIdField = simpleField({
  label: 'Bar Id',
  operator: access('id')
});

export const barPositionField = simpleField({
  label: 'Bar Position',
  operator: access('position')
});

export const barWidthField = simpleField({
  label: 'Bar Width',
  operator: access('width')
});

export const barHeightField = simpleField({
  label: 'Bar Height',
  operator: access('height')
});

export const barColorField = simpleField({
  label: 'Bar Color',
  operator: constant('black')
});

export const barStrokeColorField = simpleField({
  label: 'Bar StrokeColor',
  operator: constant('black')
});

export const barStrokeWidthField = simpleField({
  label: 'Bar StrokeWidth',
  operator: constant(0)
});

export const barTooltipField = simpleField({
  label: 'Bar Tooltip',
  operator: constant(undefined)
});

export const barLabelField = simpleField({
  label: 'Bar Label',
  operator: constant('test')
});

export const barLabelPositionField = simpleField({
  label: 'Bar LabelPosition',
  operator: constant('left')
});

export const barTransparencyField = simpleField({
  label: 'Bar Transparency',
  operator: constant(0)
});

export const barStrokeTransparencyField = simpleField({
  label: 'Bar StrokeTransparency',
  operator: constant(0)
});

export const barPulseField = simpleField({
  label: 'Bar Pulse',
  operator: constant(false)
});
