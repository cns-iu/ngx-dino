import { Component, Input } from '@angular/core';
import { geoAlbersUsa } from 'd3-geo';
import { geoEckert4 } from 'd3-geo-projection';
import { Observable, interval, EMPTY } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { BoundField, DatumId, RawChangeSet } from '@ngx-dino/core';
import { BuiltinSymbolTypes, Point } from '@ngx-dino/network';
import * as fields from '../shared/geomap/geomap-fields';
import nodeData from '../shared/geomap/point-dummy-data';
import stateData from '../shared/geomap/state-dummy-data';


@Component({
  selector: 'app-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.sass']
})
export class GeomapComponent {
  @Input() height: number;
  @Input() width: number;

  // Basemap
  basemapSelector = ['world', 'countries'];
  basemapProjection = geoEckert4();
  basemapDefaultColor = 'lightgray';
  // TODO other basemap fields

  // Nodes
  nodeStream: Observable<RawChangeSet> = interval(1000).pipe(
    take(nodeData.length),
    map(index => nodeData[index]),
    map(item => [item]),
    map(RawChangeSet.fromArray)
  );
  nodeIdField: BoundField<DatumId> = fields.nodeIdField.getBoundField();
  nodePositionField: BoundField<Point> = fields.nodePositionField.getBoundField();
  nodeSizeField: BoundField<number> = fields.nodeSizeField.getBoundField();
  nodeSymbolField: BoundField<BuiltinSymbolTypes> = fields.nodeSymbolField.getBoundField();
  nodeColorField: BoundField<string> = fields.nodeColorField.getBoundField();
  nodeStrokeColorField: BoundField<string> = fields.nodeStrokeColorField.getBoundField();
  nodeStrokeWidthField: BoundField<number> = fields.nodeStrokeWidthField.getBoundField();
  nodeTooltipField: BoundField<string> = fields.nodeTooltipField.getBoundField();
  nodeLabelField: BoundField<string> = fields.nodeLabelField.getBoundField();
  nodeLabelPositionField: BoundField<string> = fields.nodeLabelPositionField.getBoundField();
  nodeTransparencyField: BoundField<number> = fields.nodeTransparencyField.getBoundField();
  nodeStrokeTransparencyField: BoundField<number> = fields.nodeStrokeTransparencyField.getBoundField();

  // Edges
  edgeStream: Observable<RawChangeSet> = EMPTY;
  edgeIdField: BoundField<DatumId>;
  edgeSourceField: BoundField<Point>;
  edgeTargetField: BoundField<Point>;
  edgeStrokeColorField: BoundField<string>;
  edgeStrokeWidthField: BoundField<number>;
  edgeTransparencyField: BoundField<number>;

  constructor() {
    console.log('albers', geoAlbersUsa);
    console.log('eckert', geoEckert4);
  }
}
