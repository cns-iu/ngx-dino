import { 
  Component, 
  OnInit, 
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import { BoundField, RawChangeSet, Datum, idSymbol } from '@ngx-dino/core';

import { Observable } from 'rxjs/Observable';

import * as d3Selection from 'd3-selection';
import * as d3Array from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { LegendDataService } from '../shared/legend-data.service';

@Component({
  selector: 'edge-size-legend',
  templateUrl: './edge-size-legend.component.html',
  styleUrls: ['./edge-size-legend.component.sass'],
  providers: [LegendDataService]
})

export class EdgeSizeLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() edgeIdField: BoundField<string>;
  @Input() edgeSizeField: BoundField<number>;

  @Input() edgeLegendTitle: string;

  @Input() edgeSizeRange: number[];
  
  edgeSizeScale: any;

  maxEdgeLegendLabel: string;
  midEdgeLegendLabel: string;
  minEdgeLegendLabel: string;

  maxEdge: number;
  midEdge: number;
  minEdge: number;

  edgesData = [];

  constructor(private dataService: LegendDataService) { }

  ngOnInit() { 
    this.dataService.edges.subscribe((data) => {
      this.edgesData = this.edgesData.filter((e: any) => !data.remove
      .some((obj: Datum<any>) => obj[idSymbol] === e.id)).concat(data.insert.toArray() as any);

      data.update.forEach((el: any) => { // TODO typing for el
        const index = this.edgesData.findIndex((e) => e.id === el[idSymbol]);
        if (index != -1) {
          this.edgesData[index] = Object.assign(this.edgesData[index] || {}, el );
        }
      });

      data.replace.forEach((el: any) => { // TODO typing for el
        const index = this.edgesData.findIndex((e) => e.id === el[idSymbol]);
        if (index != -1) {
          this.edgesData[index] = el;
        }
      });

      if (this.edgesData.length) {
        this.updateEdgeLegendLabels(this.edgesData);
        this.updateEdgeLegendSizes(this.edgesData);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataStream' in changes && this.dataStream) {
      this.edgesData = [];
      this.updateStreamProcessor(false);
    } else if (Object.keys(changes).filter((k) => k.endsWith('Field'))) {
        const changedField =  changes[Object.keys(changes).find((k) => k.endsWith('Field'))].currentValue;
        this.updateStreamProcessor(true, changedField);
        this.updateEdgeLegendLabels(this.edgesData);
        this.updateEdgeLegendSizes(this.edgesData);
    }
  }

  updateStreamProcessor(update = true, changedField?: BoundField<number | string>) {
    if (update && changedField) {
      this.dataService.updateData(changedField);
    }
    if (!update) {
      this.dataService.fetchData(
        // TODO
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,

        this.dataStream,
        this.edgeIdField,
        this.edgeSizeField
      );
    }
  }
  updateEdgeLegendLabels(edges: any[]) {
    this.maxEdge = Math.round(d3Array.max(edges, (d: any) => Math.abs(d.size)));
    this.minEdge = Math.round(d3Array.min(edges, (d: any) => Math.abs(d.size)));
    this.midEdge = Math.round((this.maxEdge + this.minEdge) / 2);

    this.maxEdgeLegendLabel = (!isNaN(this.maxEdge)) ? this.maxEdge.toString() : '';
    this.midEdgeLegendLabel = (!isNaN(this.midEdge)) ? this.midEdge.toString() : '';
    this.minEdgeLegendLabel = (!isNaN(this.minEdge)) ? this.minEdge.toString() : '';
  }

  updateEdgeLegendSizes(edges: any[]) {
    this.edgeSizeScale = scaleLinear()
    .domain([0, d3Array.max(edges, (d: any) => Math.abs(d.size))])
    .range(this.edgeSizeRange);

    d3Selection.select('#maxEdge').select('line').attr('stroke-width', this.edgeSizeScale(Math.abs(this.maxEdge)));
    d3Selection.select('#midEdge').select('line').attr('stroke-width', this.edgeSizeScale(Math.abs(this.midEdge)));
    d3Selection.select('#minEdge').select('line').attr('stroke-width', this.edgeSizeScale(Math.abs(this.minEdge)));
  }
}