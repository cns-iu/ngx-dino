import {
  Component,
  OnInit,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import * as d3Shape from 'd3-shape';
import 'd3-transition';

import { Observable } from 'rxjs';

import { BoundField, RawChangeSet, idSymbol, Datum } from '@ngx-dino/core';

import { LegendDataService } from '../shared/legend-data.service';

@Component({
  selector: 'node-size-legend',
  templateUrl: './node-size-legend.component.html',
  styleUrls: ['./node-size-legend.component.sass'],
  providers: [LegendDataService]
})
export class NodeSizeLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() nodeIdField: BoundField<number | string>;
  @Input() nodeSizeRangeField: BoundField<number | string>;
  @Input() nodeSizeDomainField: BoundField<number | string>;
  @Input() nodeShapeField: BoundField<number | string>;
  
  @Input() title = 'Node Size';
  @Input() encoding = 'Encoding';

  @Input() margin: string; // format - 'top right bottom left'

  parentNativeElement: any;
  legendSizeScale: any;

  max: string;
  mid: string;
  min: string;

  maxLabel: string;
  midLabel: string;
  minLabel: string;

  nodesData = [];

  domain = [];
  range = [];
  

  constructor(element: ElementRef, private dataService: LegendDataService) {
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() {
    this.dataService.nodes.subscribe((data) => {
      this.nodesData = this.nodesData.filter((e: any) => !data.remove
      .some((obj: Datum<any>) => obj[idSymbol] === e.id)).concat(data.insert.toArray() as any);

      data.update.forEach((el: any) => { // TODO typing for el
        const index = this.nodesData.findIndex((e) => e.id === el[idSymbol]);
        if (index !== -1) {
          this.nodesData[index] = Object.assign(this.nodesData[index] || {}, el );
        }
      });

      data.replace.forEach((el: any) => { // TODO typing for el
        const index = this.nodesData.findIndex((e) => e.id === el[idSymbol]);
        if (index !== -1) {
          this.nodesData[index] = el;
        }
      });

      if (this.nodesData.length > 0) {
        this.calculateBoundsAndLabels(this.nodesData);
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataStream' in changes && this.dataStream) {
      this.nodesData = [];
      this.updateStreamProcessor(false);
    } else if (Object.keys(changes).filter((k) => k.endsWith('Field')).length > 0) {
      const changedFields =  Object.keys(changes).filter((k) => k.endsWith('Field'));
      changedFields.forEach((f) => {
        this.updateStreamProcessor(true, changes[f].currentValue);
      })
    
      if(this.nodesData.length > 0) {
        this.calculateBoundsAndLabels(this.nodesData);
      }
    }
  }

  updateStreamProcessor(update = true, changedField?: BoundField<number | string>) {
    if (update && changedField) {
      this.dataService.updateData(changedField);
    }
    if (!update) {
      this.dataService.fetchData(
        this.dataStream,
        this.nodeIdField,
        this.nodeSizeDomainField,
        this.nodeSizeRangeField,
        this.nodeShapeField ? this.nodeShapeField : undefined,
        // TODO
        undefined,
        undefined,
        undefined
      );
    }
  }

  calculateBoundsAndLabels(data: any) {
    const sortedData = data.sort(this.comparator);
    this.min = d3Shape.symbol().size(sortedData[0].size)
      .type(this.selectShape(sortedData[0]))();
    this.mid = d3Shape.symbol()
      .size(sortedData[Math.round((sortedData.length - 1) / 2)].size)
      .type(this.selectShape(sortedData[Math.round((sortedData.length - 1) / 2)]))();
    this.max = d3Shape.symbol().size(sortedData[sortedData.length - 1].size)
      .type(this.selectShape(sortedData[sortedData.length - 1]))();
  
    this.minLabel = typeof sortedData[0].sizeInput === 'object' ? 'None' :  sortedData[0].sizeInput;
    this.midLabel = typeof sortedData[Math.round((sortedData.length - 1) / 2)].sizeInput === 'object' ? 'None' : sortedData[Math.round((sortedData.length - 1) / 2)].sizeInput;
    this.maxLabel = typeof sortedData[sortedData.length - 1].sizeInput === 'object' ? 'None' : sortedData[sortedData.length - 1].sizeInput;
  }

  selectShape(dataEntry: any) {
    switch (dataEntry.shape) {
      case 'circle': return d3Shape.symbolCircle;
      case 'square': return d3Shape.symbolSquare;
      case 'cross': return d3Shape.symbolCross;
      case 'diamond': return d3Shape.symbolDiamond;
      case 'triangle-up': return d3Shape.symbolTriangle;
      case 'triangle-down': return d3Shape.symbolTriangle;
      case 'triangle-left': return d3Shape.symbolTriangle;
      case 'triangle-right': return d3Shape.symbolTriangle;
      case 'star': return d3Shape.symbolStar;
      default: return d3Shape.symbolCircle;
    }
  }

  comparator(a: any, b: any) {
    return a.size - b.size;
  }
}