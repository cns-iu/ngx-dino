import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { RawChangeSet, BoundField, DataType } from '@ngx-dino/core';
import { SummaryDataService, SummaryStatistics, DataItem, validField } from '../shared/summary-data.service';
import { some, isNumber, orderBy } from 'lodash';


@Component({
  selector: 'dino-area-size-legend',
  templateUrl: './area-size-legend.component.html',
  styleUrls: ['./area-size-legend.component.scss'],
  providers: [SummaryDataService]
})
export class AreaSizeLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() idField: BoundField<number | string>;
  @Input() areaSizeField: BoundField<number>;
  @Input() inputField: BoundField<number | string>;
  @Input() labelField: BoundField<string>;
  @Input() orderField: BoundField<number>;

  items: DataItem[];
  stats: SummaryStatistics;
  legendType: 'quantitative' | 'qualitative';

  private dataSubscription: Subscription;

  constructor(private summaryDataService: SummaryDataService) { }

  ngOnInit() {
    this.updateSubscription();
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
  private setItems(items: DataItem[]) {
    this.items = orderBy(items.map(i => this.convertDataItem(i)), 'value', 'desc');
  }
  private convertDataItem(dataItem: DataItem): DataItem {
    return Object.assign({}, dataItem, {
      value: this.areaToDiameter(dataItem.value)
    });
  }
  private areaToDiameter(value: string | number) {
    if (!isNumber(value) || !isFinite(Number(value))) {
      return 1;
    } else {
      return Math.max(1, Math.sqrt(Number(value) / Math.PI) * 2);
    }
  }

  private updateLegendType() {
    const field = validField(this.inputField) || this.areaSizeField;
    const oldLegendType = this.legendType;
    if (field.dataType === DataType.Number) {
      this.legendType = 'quantitative';
    } else {
      this.legendType = 'qualitative';
    }
    if (oldLegendType !== this.legendType) {
      this.updateSubscription();
    }
  }
  private updateSubscription() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.items = [];
    this.stats = null;

    if (this.legendType === 'quantitative') {
      this.dataSubscription = this.summaryDataService.observeStatistics().subscribe(this.setStatistics.bind(this));
    } else {
      this.dataSubscription = this.summaryDataService.observeUniqueItems().subscribe(this.setItems.bind(this));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('areaSizeField' in changes || 'inputField' in changes) {
      this.updateLegendType();
    }
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
