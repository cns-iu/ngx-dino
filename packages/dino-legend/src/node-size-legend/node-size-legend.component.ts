import {
  Component,
  OnInit,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import * as d3Selection from 'd3-selection';
import * as d3Array from 'd3-array';
import { scaleLinear } from 'd3-scale';
import 'd3-transition';

import  { Observable } from 'rxjs/Observable';

import { BoundField, RawChangeSet, idSymbol, Datum } from '@ngx-dino/core';

import  { LegendDataService } from '../shared/legend-data.service';

@Component({
  selector: 'node-size-legend',
  templateUrl: './node-size-legend.component.html',
  styleUrls: ['./node-size-legend.component.sass'],
  providers: [LegendDataService]
})
export class NodeSizeLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: Observable<RawChangeSet<any>>;
  
  @Input() nodeSizeField: BoundField<string>;
  @Input() nodeIdField: BoundField<number | string>;

  @Input() title: string;
  
  @Input()  nodeSizeRange = [5, 15];

  parentNativeElement: any;
  legendSizeScale: any;
  
  max: number;
  mid: number;
  min: number;
  
  maxLabel: string;
  midLabel: string;
  minLabel: string;

  nodesData = [];

  constructor(element: ElementRef, private dataService: LegendDataService) {
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() {
    this.dataService.nodes.subscribe((data) => {
      this.nodesData = this.nodesData.filter((e: any) => !data.remove
        .some((obj: Datum<any>) => obj[idSymbol] === e.id)).concat(data.insert.toArray());
     
      data.update.forEach((el) => {
        const index = this.nodesData.findIndex((e) => e.id === el[1].id);
        this.nodesData[index] = Object.assign(this.nodesData[index] || {}, el[1]);
      });

      if (this.nodesData.length) {
        console.log(this.nodesData)
        this.max = Math.round(parseInt(d3Array.max(this.nodesData, (d: any) => d.size)));
        this.min = Math.round(parseInt(d3Array.min(this.nodesData, (d: any) => d.size)));
        this.mid = Math.round((this.max + this.min) / 2);

        this.maxLabel = (!isNaN(this.max))? this.max.toString(): '';
        this.midLabel = (!isNaN(this.mid))? this.mid.toString(): '';
        this.minLabel = (!isNaN(this.min))? this.min.toString(): '';
            
        this.setScales();
        this.setSizes();
        this.setTexts();
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataStream' in changes && this.dataStream) {
      this.nodesData = [];
      this.updateStreamProcessor(false);
    } else if (Object.keys(changes).filter((k) => k.endsWith('Field'))) {
      this.updateStreamProcessor();
    }

    if ('title' in changes) {
      d3Selection.select(this.parentNativeElement)
        .select('#title').transition().text(this.title);
    }
  }

  updateStreamProcessor(update = true) {
    if (update) {
      this.dataService.updateData(); // TODO
    }
    if (!update) {
      this.dataService.fetchData(
        this.dataStream,
        this.nodeIdField,
        this.nodeSizeField, 
        
        // TODO
        undefined,
        undefined,
        undefined
      );
    }
  }

  setScales() {
    this.legendSizeScale = scaleLinear()
      .domain([this.min, this.max])
      .range(this.nodeSizeRange);
  }

  setSizes() {
    d3Selection.select(this.parentNativeElement)
      .select('#maxNode').transition().attr('r', this.legendSizeScale(this.max));

    d3Selection.select(this.parentNativeElement)
      .select('#midNode').transition().attr('r', this.legendSizeScale(this.mid));

    d3Selection.select(this.parentNativeElement)
      .select('#minNode').transition().attr('r', this.legendSizeScale(this.min));
  }

  setTexts() {
    d3Selection.select(this.parentNativeElement)
      .select('#title').transition().text(this.title);

    d3Selection.select(this.parentNativeElement)
      .select('#maxG').select('text').transition().text(this.maxLabel);

    d3Selection.select(this.parentNativeElement)
      .select('#midG').select('text').transition().text(this.midLabel);

    d3Selection.select(this.parentNativeElement)
      .select('#minG').select('text').transition().text(this.minLabel);
  }
}
