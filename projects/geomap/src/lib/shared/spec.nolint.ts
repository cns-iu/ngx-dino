// tslint:disable
export default {
  '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
  'autosize': 'none',

  'data': [
    {
      'name': 'geoJson',
      'transform': [{
        'type': 'formula',
        'expr': 'substring(datum.id, 0, 2)',
        'as': 'id'
      }]
    },
    {'name': 'regionColors'},
    {'name': 'regionStrokeColors'},

    {
      'name': 'filteredGeoJson',
      'source': 'geoJson',
      'transform': [{
        'type': 'filter',
        'expr': '!selectedRegion || datum.id == selectedRegion'
      }]
    },
    {
      'name': 'geoJsonBounds',
      'source': 'filteredGeoJson',
      'transform': [
        {
          'type': 'formula',
          'expr': 'geoBounds("rawProjection", datum)',
          'as': 'bounds'
        },
        {
          'type': 'aggregate',
          'fields': [
            'bounds[0][0]', 'bounds[0][1]', 'bounds[1][0]', 'bounds[1][1]'
          ],
          'ops': [
            'min', 'min', 'max', 'max'
          ],
          'as': [
            'xMin', 'yMin', 'xMax', 'yMax'
          ]
        },
        {
          'type': 'extent',
          'field': 'xMin',
          'signal': 'rawXMin'
        },
        {
          'type': 'extent',
          'field': 'yMin',
          'signal': 'rawYMin'
        },

        {
          'type': 'formula',
          'expr': 'datum.xMax - datum.xMin',
          'as': 'xDiff'
        },
        {
          'type': 'formula',
          'expr': 'datum.yMax - datum.yMin',
          'as': 'yDiff'
        },
        {
          'type': 'extent',
          'field': 'xDiff',
          'signal': 'rawXDiff'
        },
        {
          'type': 'extent',
          'field': 'yDiff',
          'signal': 'rawYDiff'
        },

        {
          'type': 'formula',
          'expr': '960 / datum.xDiff',
          'as': 'xFactor'
        },
        {
          'type': 'formula',
          'expr': '500 / datum.yDiff',
          'as': 'yFactor'
        },
        {
          'type': 'formula',
          'expr': 'min(datum.xFactor, datum.yFactor)',
          'as': 'factor'
        },
        {
          'type': 'extent',
          'field': 'factor',
          'signal': 'rawFactor'
        }
      ]
    },

    {
      'name': 'geoJsonWithPath',
      'source': 'filteredGeoJson',
      'transform': [{
        'type': 'geopath',
        'projection': 'projection'
      }]
    },
    {
      'name': 'geoJsonWithPathAndData',
      'source': 'geoJsonWithPath',
      'transform': [
        {
          'type': 'lookup',
          'from': 'regionColors',
          'key': 'id',
          'fields': ['id'],
          'values': ['color'],
          'as': ['color'],
          'default': {'signal': 'defaultRegionColor'}
        },
        {
          'type': 'lookup',
          'from': 'regionStrokeColors',
          'key': 'id',
          'fields': ['id'],
          'values': ['strokeColor'],
          'as': ['strokeColor'],
          'default': {'signal': 'defaultRegionStrokeColor'}
        }
      ]
    },

    {
      'name': 'points',
      'transform': [
        {
          'type': 'geopoint',
          'projection': 'projection',
          'fields': [
            'longitude',
            'latitude'
          ]
        },
        {
          'type': 'filter',
          'expr': 'datum.x != null && datum.y != null'
        },
        {
          'type': 'formula',
          'expr': 'datum.shape || "circle"',
          'as': 'shape'
        }
      ]
    },
    {
      'name': 'pointTitles',
      'source': 'points',
      'transform': [
        {
          'type': 'filter',
          'expr': 'datum.title != null'
        },
        {
          'type': 'formula',
          'expr': '-sqrt(datum.size)',
          'as': 'offset'
        }
      ]
    },
    {
      'name': 'pulsingPoints',
      'source': 'points',
      'transform': [{
        'type': 'filter',
        'expr': 'datum.pulse === true'
      }]
    }
  ],

  'signals': [
    {'name': 'selectedRegion'},
    {
      'name': 'defaultRegionColor',
      'value': '#ffffff'
    },
    {
      'name': 'defaultRegionStrokeColor',
      'value': '#000000'
    },

    {
      'name': 'widthFactor',
      'update': 'width / 900'
    },
    {
      'name': 'heightFactor',
      'update': 'height / 500'
    },
    {
      'name': 'factor',
      'update': 'rawFactor[0]'
    },
    {
      'name': 'scaleFactor',
      'update': 'min(widthFactor, heightFactor) * factor'
    },

    {
      'name': 'xMin',
      'update': 'rawXMin[0]'
    },
    {
      'name': 'yMin',
      'update': 'rawYMin[0]'
    },
    {
      'name': 'xDiff',
      'update': 'rawXDiff[0]'
    },
    {
      'name': 'yDiff',
      'update': 'rawYDiff[0]'
    },

    {
      'name': 'tX',
      'update': 'width * (1 - (xMin + xDiff / 2) / 960)'
    },
    {
      'name': 'tY',
      'update': 'height * (1 - (yMin + yDiff / 2) / 500)'
    }
  ],

  'scales': [],

  'projections': [
    {
      'name': 'rawProjection',
      'type': 'albersUsa'
    },

    {
      'name': 'projection',
      'type': 'albersUsa',
      'scale': {'signal': '1070 * scaleFactor'},
      'translate': [
        {'signal': 'tX'},
        {'signal': 'tY'}
      ]
    }
  ],

  'marks': [
    {
      'type': 'path',
      'from': {'data': 'geoJsonWithPathAndData'},
      'encode': {
        'update': {
          'fill': {'field': 'color'},
          'stroke': {'field': 'strokeColor'},
          'path': {'field': 'path'}
        }
      }
    },

    {
      'type': 'group',
      'from': {'data': 'pulsingPoints'},
      'encode': {
        'update': {
          'x': {'field': 'x'},
          'y': {'field': 'y'}
        }
      },
      'marks': [
        {
          'type': 'symbol',
          'name': 'pulsing',
          'encode': {
            'enter': {
              'fill': {'value': ''},
              'opacity': {'value': ''}
            },
            'update': {
              'shape': {'signal': 'parent.shape'},
              'size': {'signal': 'parent.size'},
              'stroke': {
                'signal': 'if(parent.color === "#ffffff", "#000000", parent.stroke)'
              }
            }
          }
        }
      ]
    },
    {
      'type': 'symbol',
      'from': {'data': 'points'},
      'encode': {
        'update': {
          'shape': {'field': 'shape'},
          'x': {'field': 'x'},
          'y': {'field': 'y'},
          'size': {'field': 'size'},
          'fill': {'field': 'color'},
          'stroke': {
            'signal': 'if(datum.color === "#ffffff", "#000000", datum.stroke)'
          },
          'strokeWidth': {'value': 1}
        }
      }
    },
    {
      'type': 'text',
      'from': {'data': 'pointTitles'},
      'encode': {
        'enter': {
          'align': {'value': 'center'},
          'fontSize': {'value': 20},
          'stoke': {'value': 'white'},
          'strokeOpacity': {'value': 0.5},
          'fill': {'value': 'black'}
        },
        'update': {
          'text': {'field': 'title'},
          'x': {'field': 'x'},
          'y': {'field': 'y'},
          'dy': {'field': 'offset'}
        }
      }
    }
  ]
};
