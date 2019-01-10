import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { RawChangeSet, BoundField } from '@ngx-dino/core';
import { SummaryDataService, SummaryStatistics, DataItem } from '../shared/summary-data.service';
import { some, isNumber } from 'lodash';

@Component({
  selector: 'dino-stroke-width-legend',
  templateUrl: './stroke-width-legend.component.html',
  styleUrls: ['./stroke-width-legend.component.scss'],
  providers: [SummaryDataService]
})
export class StrokeWidthLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() idField: BoundField<number | string>;
  @Input() strokeWidthField: BoundField<number>;
  @Input() inputField: BoundField<number | string>;
  @Input() labelField: BoundField<string>;
  @Input() orderField: BoundField<number>;

  stats: SummaryStatistics;

  constructor(private summaryDataService: SummaryDataService) { }

  ngOnInit() {
    this.summaryDataService.observeStatistics().subscribe(this.setStatistics.bind(this));
  }

  private setStatistics(stats: SummaryStatistics) {
    if (!stats || !stats.min) {
      this.stats = null;
    } else {
      this.stats = {
        min: this.convertDataItem(stats.min),
        max: this.convertDataItem(stats.max),
        median: this.convertDataItem(stats.median)
      };
    }
  }
  private convertDataItem(dataItem: DataItem): DataItem {
    return Object.assign({}, dataItem, {
      value: this.validStrokeWidth(dataItem.value)
    });
  }
  private validStrokeWidth(value: string | number) {
    if (!isNumber(value) || !isFinite(Number(value)) || Number(value) < 0) {
      return 1;
    } else {
      return Math.max(1, Number(value));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('dataStream' in changes || 'idField' in changes) {
      this.createProcessor();
    } else if (some(changes, (_value, key) => /^\w+Field$/.test(key))) {
      this.updateProcessor();
    }
  }
  private createProcessor() {
    if (!this.dataStream || !this.idField) {
      this.summaryDataService.clearProcessor();
    } else {
      this.summaryDataService.createProcessor(this.dataStream, this.idField,
        this.strokeWidthField, this.inputField, this.labelField, this.orderField);
    }
  }
  private updateProcessor() {
    this.summaryDataService.updateProcessor(
      this.strokeWidthField, this.inputField, this.labelField, this.orderField);
  }
}
