import {
   Component,
   OnInit,
    Input,
    SimpleChanges,
    OnChanges } from '@angular/core';

import { RawChangeSet, BoundField, Datum, idSymbol } from '@ngx-dino/core';

import * as d3Array from 'd3-array';

import { Observable } from 'rxjs';
import { LegendDataService } from '../shared/legend-data.service';
import { SizeMapping } from '../shared/size-mapping';

@Component({
  selector: 'dino-start-legend',
  templateUrl: './start-legend.component.html',
  styleUrls: ['./start-legend.component.css'],
  providers: [LegendDataService]
})
export class StartLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() sizeField: BoundField<string | number>;
  @Input() idField: BoundField<number | string>;
  @Input() categoryField: BoundField<string>;

  @Input() sizeMapping: SizeMapping[] = [];

  @Input() legendType: string;

  @Input() margin: string; // format - 'top right bottom left'

  minLabel = '0';
  midLabel = '0';
  maxLabel = '0';
  data = [];

  constructor(private dataService: LegendDataService) { }

  ngOnInit() {
    this.dataService.nodes.subscribe((data) => {
      this.data = this.data.filter((e: any) => !data.remove
      .some((obj: Datum<any>) => obj[idSymbol] === e.id)).concat(data.insert.toArray() as any);

      data.update.forEach((el: any) => { // TODO typing for el
        const index = this.data.findIndex((e) => e.id === el[idSymbol]);
        if (index !== -1) {
          this.data[index] = Object.assign(this.data[index] || {}, el );
        }
      });

      data.replace.forEach((el: any) => { // TODO typing for el
        const index = this.data.findIndex((e) => e.id === el[idSymbol]);
        if (index !== -1) {
          this.data[index] = el;
        }
      });

      if (this.data.length > 0) {
        if (this.legendType === 'quantitative') {
          this.calculateBoundLabels(this.data);
        } else if (this.legendType === 'qualitative') {
            this.calculateSizeMapping();
          }
      }
    });
   }

  ngOnChanges(changes: SimpleChanges) {
    console.log('start changes', changes)
    if ('dataStream' in changes && this.dataStream) {
      this.data = [];
      this.updateStreamProcessor(false);
    } else if ('sizeField' in changes) {
        this.updateStreamProcessor(true, this.sizeField);
        if (this.legendType === 'quantitative') {
          this.calculateBoundLabels(this.data);
        } else if (this.legendType === 'qualitative') {
            this.calculateSizeMapping();
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
        this.idField,
        this.sizeField,
        undefined,
        this.categoryField ? this.categoryField : undefined,

        // TODO
        undefined,
        undefined,
        undefined,

      );
    }
  }

  calculateBoundLabels(data: any) {
    console.log('start', data);
    const max = Math.round(parseInt(d3Array.max(data, (d: any) => d.size), 10));
    const min = Math.round(parseInt(d3Array.min(data, (d: any) => d.size), 10));
    const mid = Math.round((max + min) / 2);

    this.maxLabel = (!isNaN(max)) ? max.toString() : '';
    this.midLabel = (!isNaN(mid)) ? mid.toString() : '';
    this.minLabel = (!isNaN(min)) ? min.toString() : '';
  }

  calculateSizeMapping() {
    this.data.forEach((d) => {
      if (d.category !== null) {
        if (this.sizeMapping.length > 0) {
          const index = this.sizeMapping.findIndex((m) => m.label === d.category);
          if (index === -1) {
            this.sizeMapping.push({
              'label': d.category,
              'size': d.size
            });
          }
        } else {
          this.sizeMapping.push({
            'label': d.category,
            'size': d.size
          });
        }
      }
    });
  }

}
