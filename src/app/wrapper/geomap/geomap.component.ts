import { Component, Input } from '@angular/core';
import { Observable, interval, EMPTY } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { BoundField, DatumId, RawChangeSet } from '@ngx-dino/core';
import { BuiltinSymbolTypes, Point } from '@ngx-dino/network';
import * as fields from '../shared/geomap/geomap-fields';
import nodeData from '../shared/geomap/point-dummy-data';


@Component({
  selector: 'app-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.sass']
})
export class GeomapComponent {
  @Input() height: number;
  @Input() width: number;

  // Basemap
  basemapZoomLevels = [
    // { selector: ['world', 'united states', 'states'], projection: 'albersUsa', label: 'United States', class: '' }
  ];
  basemapSelectedZoomLevel = 0;
  basemapDefaultColor = 'white';
  basemapDefaultStrokeColor = '#bebebe';
  // TODO other basemap fields

  // Nodes
  nodeStream: Observable<RawChangeSet> = interval(1000).pipe(
    take(nodeData.length),
    map(index => nodeData[index]),
    map(item => [item]),
    map(RawChangeSet.fromArray)
  );
  nodeIdField: BoundField<DatumId> = fields.nodeIdField.getBoundField();
  nodePositionField: BoundField<Point> = undefined;
  nodeLatitudeField: BoundField<number> = fields.nodeLatitudeField.getBoundField();
  nodeLongitudeField: BoundField<number> = fields.nodeLongitudeField.getBoundField();
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
  nodePulseField: BoundField<boolean> = fields.nodePulseField.getBoundField();

  // Edges
  edgeStream: Observable<RawChangeSet> = EMPTY;
  edgeIdField: BoundField<DatumId>;
  edgeSourceField: BoundField<Point>;
  edgeTargetField: BoundField<Point>;
  edgeStrokeColorField: BoundField<string>;
  edgeStrokeWidthField: BoundField<number>;
  edgeTransparencyField: BoundField<number>;
}
