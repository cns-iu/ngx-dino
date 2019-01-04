import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { RawChangeSet, BoundField } from '@ngx-dino/core';
import { SummaryDataService, SummaryStatistics, DataItem } from '../shared/summary-data.service';
import { some, isNumber } from 'lodash';


@Component({
  selector: 'dino-area-size-legend',
  templateUrl: './area-size-legend.component.html',
  styleUrls: ['./area-size-legend.component.scss'],
  providers: [SummaryDataService]
})
export class AreaSizeLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() idField: BoundField<number | string>;
  @Input() areaSizeField: BoundField<string>;
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
      value: this.areaToRadius(dataItem.value)
    });
  }
  private areaToRadius(value: string | number) {
    if (!isNumber(value) || !isFinite(Number(value))) {
      return 0;
    } else {
      return Math.sqrt(Number(value) / Math.PI);
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
        this.areaSizeField, this.inputField, this.labelField, this.orderField);
    }
  }
  private updateProcessor() {
    this.summaryDataService.updateProcessor(
      this.areaSizeField, this.inputField, this.labelField, this.orderField);
  }
}
