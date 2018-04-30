import { Component, OnInit } from '@angular/core';
import { BoundField } from '@ngx-dino/core';

import { ForceNetworkDataService } from '../shared/force-network/force-network-data.service';
import {
  nodeIdField,
  nodeSizeField,
  nodeColorField,
  nodeLabelField,

  edgeSizeField,
} from '../shared/force-network/force-network-fields';

@Component({
  selector: 'app-force-network',
  templateUrl: './force-network.component.html',
  styleUrls: ['./force-network.component.sass'],
  providers: [ForceNetworkDataService]
})
export class ForceNetworkComponent implements OnInit {

  networkGraph: any;

  nodeId: BoundField<string>;
  nodeSize: BoundField<number>;
  nodeColor: BoundField<number>;
  nodeLabel: BoundField<string>;
  nodeColorRange: [string, string, string] | [string, string];

  edgeSize: BoundField<number>;

  constructor(private dataService: ForceNetworkDataService) {  }

  ngOnInit() {
    this.nodeId = nodeIdField.getBoundField();
    this.nodeSize = nodeSizeField.getBoundField();
    this.nodeColor = nodeColorField.getBoundField();
    this.nodeLabel = nodeLabelField.getBoundField();
    this.nodeColorRange =  ['#FDD3A1', '#E9583D', '#7F0000'];

    this.edgeSize = edgeSizeField.getBoundField();

    this.networkGraph = this.dataService.filteredNetworkGraph;
  }

}
