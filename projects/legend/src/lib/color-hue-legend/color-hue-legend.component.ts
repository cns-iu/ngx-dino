import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { RawChangeSet, BoundField, DataType } from '@ngx-dino/core';
import { SummaryDataService, SummaryStatistics, DataItem, validField } from '../shared/summary-data.service';
import { some } from 'lodash';


@Component({
  selector: 'dino-color-hue-legend',
  templateUrl: './color-hue-legend.component.html',
  styleUrls: ['./color-hue-legend.component.scss'],
  providers: [SummaryDataService]
})
export class ColorHueLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() idField: BoundField<number | string>;
  @Input() colorField: BoundField<string>;
  @Input() inputField: BoundField<number | string>;
  @Input() labelField: BoundField<string>;
  @Input() orderField: BoundField<number>;

  items: DataItem[];
  stats: SummaryStatistics;
  linearGradient: SafeStyle;
  legendType: 'quantitative' | 'qualitative';

  private dataSubscription: Subscription;

  constructor(private summaryDataService: SummaryDataService, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.updateSubscription();
  }

  private setStatistics(stats: SummaryStatistics) {
    if (!stats || !stats.min) {
      this.stats = null;
    } else {
      const gradient = `linear-gradient(to bottom, ${stats.max.value}, ${ stats.median.value }, ${ stats.min.value })`;
      this.linearGradient = this.domSanitizer.bypassSecurityTrustStyle(gradient);
      this.stats = stats;
    }
  }

  private updateLegendType() {
    const field = validField(this.inputField) || this.colorField;
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
      this.dataSubscription = this.summaryDataService.observeUniqueItems().subscribe(items => this.items = items);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('colorField' in changes || 'inputField' in changes) {
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
        this.colorField, this.inputField, this.labelField, this.orderField);
    }
  }
  private updateProcessor() {
    this.summaryDataService.updateProcessor(
      this.colorField, this.inputField, this.labelField, this.orderField);
  }
}
