import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import { RawChangeSet, BoundField, Datum, idSymbol } from '@ngx-dino/core';

import * as d3Array from 'd3-array';

import { Observable } from 'rxjs';

import { LegendDataService } from '../shared/color-legend/legend-data.service';
import { ColorMapping } from '../shared/color-legend/color-mapping';

@Component({
  selector: 'dino-color-legend',
  templateUrl: './color-legend.component.html',
  styleUrls: ['./color-legend.component.sass'],
  providers: [LegendDataService]
})
export class ColorLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() colorField: BoundField<string | number>;
  @Input() idField: BoundField<number | string>;
  @Input() categoryField: BoundField<string>;

  @Input() colorMapping: ColorMapping[] = [];

  @Input() legendType: string;

  @Input() title = 'Node Color';
  @Input() encoding = 'Encoding';

  @Input() colorRange: string;

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
            this.calculateColorMapping();
          }
      }
    });
   }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataStream' in changes && this.dataStream) {
      this.data = [];
      this.updateStreamProcessor(false);
    } else if (Object.keys(changes).filter((k) => k.endsWith('Field')).length > 0) {
      const changedFields =  Object.keys(changes).filter((k) => k.endsWith('Field'));

      changedFields.forEach((f) => {
        this.updateStreamProcessor(true, changes[f].currentValue);
      })

      if (this.legendType === 'quantitative') {
        this.calculateBoundLabels(this.data);
      } else if (this.legendType === 'qualitative') {
          this.colorMapping = [];
          this.calculateColorMapping();
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

        this.colorField,
        this.categoryField ? this.categoryField : undefined
      );
    }
  }

  calculateBoundLabels(data: any) {
    const max = Math.round(parseInt(d3Array.max(data, (d: any) => d.color), 10));
    const min = Math.round(parseInt(d3Array.min(data, (d: any) => d.color), 10));
    const mid = Math.round((max + min) / 2);

    this.maxLabel = (!isNaN(max)) ? max.toString() : '';
    this.midLabel = (!isNaN(mid)) ? mid.toString() : '';
    this.minLabel = (!isNaN(min)) ? min.toString() : '';
  }

  calculateColorMapping() {
    this.data.forEach((d) => {
      if (d[this.categoryField.id] !== null) {
        if (this.colorMapping.length > 0) {
          const index = this.colorMapping.findIndex((m) => m.label === d[this.categoryField.id]);
          if (index === -1) {
            this.colorMapping.push({
              'label': d[this.categoryField.id],
              'color': d[this.colorField.id]
            });
          }
        } else {
          this.colorMapping.push({
            'label': d[this.categoryField.id],
            'color': d[this.colorField.id]
          });
        }
      }
    });

    this.colorMapping.sort(); // TODO
  }
}