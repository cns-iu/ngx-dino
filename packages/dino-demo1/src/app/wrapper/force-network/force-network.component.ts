import { Component, OnInit, Input } from '@angular/core';
import { BoundField, RawChangeSet } from '@ngx-dino/core';

import { Observable } from 'rxjs/Observable';

import {
  nodeIdField,
  nodeSizeField,
  nodeColorField,
  nodeLabelField,

  edgeSourceField,
  edgeTargetField,
  edgeSizeField,

  tooltipTextField
} from '../shared/force-network/force-network-fields';
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

  nodesData: Observable<RawChangeSet<any>>;
  nodeId: BoundField<string>;
  nodeSize: BoundField<number>;
  nodeColor: BoundField<number>;
  nodeLabel: BoundField<string>;
  
  edgesData: Observable<RawChangeSet<any>>;
  edgeSource: BoundField<string>;
  edgeTarget: BoundField<string>;
  edgeSize: BoundField<number>;

  tooltipText: BoundField<number|string>;

  nodeSizeRange: number[];
  nodeColorRange: string[];

  visChargeStrength = -400;
  margin = { top: 0, bottom: 0, left: 0, right: 0 };

  enableTooltip = true;

  constructor(private dataService: ForceNetworkDataService) { 
    this.nodesData = this.dataService.nodesData;
    this.edgesData = this.dataService.linksData;
   }

  ngOnInit() {
    this.nodeId = nodeIdField.getBoundField();
    this.nodeSize = nodeSizeField.getBoundField();
    this.nodeColor = nodeColorField.getBoundField();
    this.nodeLabel = nodeLabelField.getBoundField();
  
    this.edgeSource = edgeSourceField.getBoundField();
    this.edgeTarget = edgeTargetField.getBoundField();
    this.edgeSize = edgeSizeField.getBoundField();

    this.tooltipText = tooltipTextField.getBoundField();
    
    this.nodeColorRange = this.dataService.nodeColorRange;
    this.nodeSizeRange = this.dataService.nodeSizeRange
  }

}
