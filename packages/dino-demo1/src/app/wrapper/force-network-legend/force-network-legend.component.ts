import { Component, OnInit } from '@angular/core';

import { BoundField, RawChangeSet, Datum, idSymbol } from '@ngx-dino/core';

import { Observable } from 'rxjs/Observable';

import { assign, mapValues, pick } from 'lodash';

import * as d3Selection from 'd3-selection';
import * as d3Array from 'd3-array';
import { scaleLinear } from 'd3-scale';

import * as fields from '../shared/force-network/force-network-fields';

import { ForceNetworkDataService } from '../shared/force-network/force-network-data.service';


@Component({
  selector: 'app-force-network-legend',
  templateUrl: './force-network-legend.component.html',
  styleUrls: ['./force-network-legend.component.sass'],
  providers: [ForceNetworkDataService]
})
export class ForceNetworkLegendComponent implements OnInit {
  nodeStream: Observable<RawChangeSet<any>>;
  edgeStream: Observable<RawChangeSet<any>>;

  fields: {[key: string]: BoundField<any>};

  colorLegendTitle: string;

  minColorValueLabel: string;
  midColorValueLabel: string;
  maxColorValueLabel: string;

  nodeSizeScale: any;
  nodeSizeRange: number[];

  gradient = '';
  nodes = [];
  edgeSizeRange = [1, 8];
  edgeLegendTitle = 'Absolute Distance';

  constructor(private dataService: ForceNetworkDataService) {
    this.nodeStream = this.dataService.nodeStream;

    this.dataService.nodeStream.subscribe((nodes: any) => {
      this.nodes = this.nodes.filter((e: any) => !nodes.remove
      .some((obj: Datum<any>) => obj[idSymbol] === e.id)).concat(nodes.insert);
   
      nodes.update.forEach((el) => {
        const index = this.nodes.findIndex((e) => e.id === el[1].id);
        this.nodeStream[index] = Object.assign(this.nodeStream[index] || {}, <any>el[1]);
      });

      if (this.nodes.length) {
        this.updateColorLegendLabels(this.nodes);
      }
    });

    this.edgeStream = this.dataService.edgeStream;
  }

  ngOnInit() {
    const combinedFields = assign({}, fields, pick(this.dataService, [
      'nodeIdField', 'nodeSizeField', 'nodeColorField',
      'edgeIdField', 'edgeSizeField'
    ]));
    
    this.fields = mapValues(combinedFields, (f: any) => f.getBoundField());

    this.colorLegendTitle = this.dataService.colorLegendEncoding;
    this.edgeLegendTitle = this.dataService.edgeLegendEncoding;

    this.minColorValueLabel = '';
    this.midColorValueLabel = '';
    this.maxColorValueLabel = '';
    
    this.gradient = `linear-gradient(to top, ${this.dataService.nodeColorRange.join(', ')})`;

    this.nodeSizeRange = this.dataService.nodeSizeRange;
  }

  updateColorLegendLabels(nodes: any[]) {
    const maxColorValue = Math.round(d3Array.max(nodes, (d: any) => this.fields.nodeColorField.get(d)));
    const minColorValue = Math.round(d3Array.min(nodes, (d: any) => this.fields.nodeColorField.get(d)));
    const midColorValue = Math.round((maxColorValue + minColorValue) / 2);
   
    this.maxColorValueLabel = (!isNaN(maxColorValue)) ? maxColorValue.toString() : '';
    this.midColorValueLabel = (!isNaN(midColorValue)) ? midColorValue.toString() : '';
    this.minColorValueLabel = (!isNaN(minColorValue)) ? minColorValue.toString() : '';
  }

}
