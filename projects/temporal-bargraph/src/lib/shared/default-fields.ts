import { constant as constantOp, map as mapOp, simpleField } from '@ngx-dino/core';

export const defaultWeightField = simpleField({
  label: 'Default Weight',
  operator: constantOp(20)
}).getBoundField();

let counter = 0;
export const defaultStackOrderField = simpleField({
  label: 'Default Stack Order',
  operator: mapOp(() => counter++)
}).getBoundField();


export const defaultColorField = simpleField({
  label: 'Default Color',
  operator: constantOp('black')
}).getBoundField();

export const defaultTransparencyField = simpleField({
  label: 'Default Transparency',
  operator: constantOp(0)
}).getBoundField();

export const defaultStrokeColorField = simpleField({
  label: 'Default Stroke Color',
  operator: constantOp('black')
}).getBoundField();

export const defaultStrokeWidthField = simpleField({
  label: 'Default Stroke Width',
  operator: constantOp(0)
}).getBoundField();

export const defaultStrokeTransparencyField = simpleField({
  label: 'Default Stroke Transparency',
  operator: constantOp(0)
}).getBoundField();


export const defaultLabelField = simpleField({
  label: 'Default Label',
  operator: constantOp('')
}).getBoundField();

export const defaultLabelPositionField = simpleField({
  label: 'Default Label Position',
  operator: constantOp('center')
}).getBoundField();

export const defaultTooltipField = simpleField({
  label: 'Default Tooltip',
  operator: constantOp('')
}).getBoundField();
