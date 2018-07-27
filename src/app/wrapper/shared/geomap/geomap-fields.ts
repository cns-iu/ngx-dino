import { simpleField, access } from '@ngx-dino/core';

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
  operator: access('color')
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
