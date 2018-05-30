import { Operator, simpleField } from '@ngx-dino/core';
import { access } from '@ngx-dino/core/src/v2/operators/methods/extracting/access';
import { combine } from '@ngx-dino/core/src/v2/operators/methods/grouping/combine';
import { chain } from '@ngx-dino/core/src/v2/operators/methods/grouping/chain';
import { map } from '@ngx-dino/core/src/v2/operators/methods/transforming/map';

export const nodeSizeField = simpleField<number>({
  bfieldId: 'size',
  label: 'Node Size',

  operator: Operator.access('group')
});

export const nodeIdField = simpleField<string>({
  bfieldId: 'id',
  label: 'Node ID',

  operator: Operator.access('id')
});

export const nodeColorField = simpleField<number>({
  bfieldId: 'color',
  label: 'Node Color',

  operator: Operator.access('group')
});

export const nodeLabelField = simpleField<string>({
  bfieldId: 'label',
  label: 'Node Label',

  operator: Operator.access('id')
});

export const edgeIdField = simpleField({
  label: 'Edge Id',
  operator: chain(combine({
    source: access('source'),
    target: access('target')
  }), map(({source, target}) => `${source}|${target}`))
});

export const edgeSourceField = simpleField<string>({
  bfieldId: 'edgeSource',
  label: 'Edge Source',

  operator: Operator.access('source')
});

export const edgeTargetField = simpleField<string>({
  bfieldId: 'edgeTarget',
  label: 'Edge Target',

  operator: Operator.access('target')
});

export const edgeSizeField = simpleField<number>({
  bfieldId: 'edgeSize',
  label: 'Edge size',

  operator: Operator.access('value')
});

export const tooltipTextField = simpleField<number>({
  bfieldId: 'tooltipText',
  label: 'Tooltip Text',

  operator: Operator.access('group')
});