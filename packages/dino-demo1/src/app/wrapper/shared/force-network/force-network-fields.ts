import { Operator, SimpleField } from '@ngx-dino/core';
import '@ngx-dino/core/src/v2/operators/add/common';

export const nodeSizeField = new SimpleField<number>({
  defaultId: 'size',
  label: 'Node Size',

  operator: Operator.access('group')
});

export const nodeIdField = new SimpleField<string>({
  defaultId: 'id',
  label: 'Node ID',

  operator: Operator.access('id')
});

export const nodeColorField = new SimpleField<number>({
  defaultId: 'color',
  label: 'Node Color',

  operator: Operator.access('group')
});

export const nodeLabelField = new SimpleField<string>({
  defaultId: 'label',
  label: 'Node Label',

  operator: Operator.access('id')
});

export const edgeSizeField = new SimpleField<number>({
  defaultId: 'edgeSize',
  label: 'Edge size',

  operator: Operator.access('value')
});