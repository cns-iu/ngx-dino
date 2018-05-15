import { Operator, simpleField } from '@ngx-dino/core';
import '@ngx-dino/core/src/v2/operators/add/common';


export const stateField = simpleField<any>({
  label: 'State Id',
  operator: Operator.access('label')
});

export const stateColorField = simpleField<any>({
  label: 'State Color',
  operator: Operator.access('color')
});


export const pointIdField = simpleField<any>({
  label: 'Point Id',
  operator: Operator.access('id')
});

export const pointLatLongField = simpleField<any>({
  label: 'Point Latitude/Longitude',
  operator: Operator.access('lat_long')
});

export const pointSizeField = simpleField<any>({
  label: 'Point Size',
  operator: Operator.access('size')
});

export const pointColorField = simpleField<any>({
  label: 'Point Color',
  operator: Operator.access('color')
});

export const pointShapeField = simpleField<any>({
  label: 'Point Shape',
  operator: Operator.access('shape')
});

export const pointStrokeColorField = simpleField<any>({
  label: "Point Stroke Color",
  operator: Operator.access('stroke')
});

export const pointTitleField = simpleField<any>({
  label: 'Point Title',
  operator: Operator.access('title')
});
