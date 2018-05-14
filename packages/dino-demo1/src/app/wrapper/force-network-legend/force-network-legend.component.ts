import { Component, OnInit } from '@angular/core';

import { BoundField, RawChangeSet, Datum, idSymbol } from '@ngx-dino/core';

import { Observable } from 'rxjs/Observable';

import * as d3Selection from 'd3-selection';
import * as d3Array from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { nodeIdField, nodeSizeField, edgeSizeField, nodeColorField} from '../shared/force-network/force-network-fields';
import { ForceNetworkDataService } from '../shared/force-network/force-network-data.service';


@Component({
  selector: 'app-force-network-legend',
  templateUrl: './force-network-legend.component.html',
  styleUrls: ['./force-network-legend.component.sass'],
  providers: [ForceNetworkDataService]
})
export class ForceNetworkLegendComponent implements OnInit {
  nodesData: Observable<RawChangeSet<any>>;
  edgesData: Observable<RawChangeSet<any>>;

  nodeId: BoundField<number | string>;
  nodeSize: BoundField<number>;
  edgeSize: BoundField<number>;
  nodeColorEncoding: BoundField<number>;

  gradient = '';

  colorLegendTitle: string;
  edgeLegendTitle: string;

  minColorValueLabel: string;
  midColorValueLabel: string;
  maxColorValueLabel: string;

  maxEdgeLegendLabel: string;
  midEdgeLegendLabel: string;
  minEdgeLegendLabel: string;

  maxEdge: number;
  midEdge: number;
  minEdge: number;

  edgeSizeScale: any;
  nodeSizeScale: any;

  nodeSizeRange: number[];

  nodes = [];
  edges = [];

  constructor(private dataService: ForceNetworkDataService) { 
    this.nodesData = this.dataService.nodesData;

    this.dataService.nodesData.subscribe((nodes: any) => {
      this.nodes = this.nodes.filter((e: any) => !nodes.remove
      .some((obj: Datum<any>) => obj[idSymbol] === e.id)).concat(nodes.insert);
   
      nodes.update.forEach((el) => {
        const index = this.nodes.findIndex((e) => e.id === el[1].id);
        this.nodesData[index] = Object.assign(this.nodesData[index] || {}, <any>el[1]);
      });

      if (this.nodes.length) {
        this.updateColorLegendLabels(this.nodes);
      }
    });

    
    this.dataService.linksData.subscribe((edges: any) => {
      this.edges = this.edges.filter((e: any) => !edges.remove
        .some((obj: Datum<any>) => obj[idSymbol] === e.id)).concat(edges.insert);

      edges.update.forEach((el) => {
        const index = this.edges.findIndex((e) => e.id === el[1].id);
        this.edges[index] = Object.assign(this.edges[index] || {}, <any>el[1]);
      });

      if (this.edges.length) {
        this.updateEdgeLegendLabels(this.edges);
        this.updateEdgeLegendSizes(this.edges);
      }
    });

  }

  ngOnInit() {
    this.colorLegendTitle = this.dataService.colorLegendEncoding;
    this.edgeLegendTitle = this.dataService.edgeLegendEncoding;
    
    // not user facing
    this.nodeId = nodeIdField.getBoundField('id');
    this.nodeSize = nodeSizeField.getBoundField('size');
    this.edgeSize = edgeSizeField.getBoundField('edgeSize');
    this.nodeColorEncoding = nodeColorField.getBoundField('color');

    this.minColorValueLabel = '';
    this.midColorValueLabel = '';
    this.maxColorValueLabel = '';
    
    this.gradient = `linear-gradient(to top, ${this.dataService.nodeColorRange.join(', ')})`;

    this.nodeSizeRange = this.dataService.nodeSizeRange;
  }

  updateEdgeLegendLabels(edges: any[]) {
    this.maxEdge = Math.round(d3Array.max(edges, (d: any) => this.edgeSize.get(d)));
    this.minEdge = Math.round(d3Array.min(edges, (d: any) => this.edgeSize.get(d)));
    this.midEdge = Math.round((this.maxEdge + this.minEdge) / 2);

    this.maxEdgeLegendLabel = (!isNaN(this.maxEdge)) ? this.maxEdge.toString() : '';
    this.midEdgeLegendLabel = (!isNaN(this.midEdge)) ? this.midEdge.toString() : '';
    this.minEdgeLegendLabel = (!isNaN(this.minEdge)) ? this.minEdge.toString() : '';
  }

  updateEdgeLegendSizes(edges: any[]) {
    this.edgeSizeScale = scaleLinear()
    .domain([0, d3Array.max(edges, (d: any) => this.edgeSize.get(d))])
    .range(this.dataService.edgeSizeRange);

    d3Selection.select('#maxEdge').select('line').attr('stroke-width', this.edgeSizeScale(this.maxEdge));
    d3Selection.select('#midEdge').select('line').attr('stroke-width', this.edgeSizeScale(this.midEdge));
    d3Selection.select('#minEdge').select('line').attr('stroke-width', this.edgeSizeScale(this.minEdge));
  }

  updateColorLegendLabels(nodes: any[]) {
    const maxColorValue = Math.round(d3Array.max(nodes, (d: any) => this.nodeColorEncoding.get(d)));
    const minColorValue = Math.round(d3Array.min(nodes, (d: any) => this.nodeColorEncoding.get(d)));
    const midColorValue = Math.round((maxColorValue + minColorValue) / 2);
   
    this.maxColorValueLabel = (!isNaN(maxColorValue)) ? maxColorValue.toString() : '';
    this.midColorValueLabel = (!isNaN(midColorValue)) ? midColorValue.toString() : '';
    this.minColorValueLabel = (!isNaN(minColorValue)) ? minColorValue.toString() : '';
  }

}
