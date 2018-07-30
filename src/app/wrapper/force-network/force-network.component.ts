import { Component, OnInit, Input } from '@angular/core';
import { BoundField, RawChangeSet } from '@ngx-dino/core';

import { Observable } from 'rxjs';

import { assign, mapValues, pick } from 'lodash';

import * as fields from '../shared/force-network/force-network-fields';

import { ForceNetworkDataService } from '../shared/force-network/force-network-data.service';

@Component({
  selector: 'app-force-network',
  templateUrl: './force-network.component.html',
  styleUrls: ['./force-network.component.sass'],
  providers: [ForceNetworkDataService]
})
export class ForceNetworkComponent implements OnInit {

  @Input() height = window.innerHeight;
  @Input() width = window.innerWidth;

  fields: {[key: string]: BoundField<any>};

  nodeStream: Observable<RawChangeSet<any>>;
  edgeStream: Observable<RawChangeSet<any>>;

  tooltipText: BoundField<number|string>;

  nodeSizeRange: number[];
  nodeColorRange: string[];

  visChargeStrength = -400;
  margin = { top: 0, bottom: 0, left: 0, right: 0 };

  enableTooltip = true;

  constructor(private dataService: ForceNetworkDataService) {
    this.nodeStream = this.dataService.nodeStream;
    this.edgeStream = this.dataService.edgeStream;
   }

  ngOnInit() {
    const combinedFields = assign({}, fields, pick(this.dataService, [
      'nodeIdField', 'nodeSizeField', 'nodeColorField', 'nodeLabelField',
      'edgeIdfield', 'edgeSourceField', 'edgeTargetField', 'edgeSizeField',
      'tooltipTextField'
    ]));

    this.fields = mapValues(combinedFields, (f: any) => f.getBoundField());

    this.nodeColorRange = this.dataService.nodeColorRange;
    this.nodeSizeRange = this.dataService.nodeSizeRange;
  }

}
