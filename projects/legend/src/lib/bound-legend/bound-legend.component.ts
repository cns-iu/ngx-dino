import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { RawChangeSet, BoundField } from '@ngx-dino/core';
import { SummaryDataService, SummaryStatistics, DataItem } from '../shared/summary-data.service';
import { some, isNumber } from 'lodash';

@Component({
  selector: 'dino-bound-legend',
  templateUrl: './bound-legend.component.html',
  styleUrls: ['./bound-legend.component.scss'],
  providers: [SummaryDataService]
})
export class BoundLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() idField: BoundField<number | string>;
  @Input() valueField: BoundField<number>;
  @Input() inputField: BoundField<number | string>;
  @Input() labelField: BoundField<string>;
  @Input() orderField: BoundField<number>;

  @Input() boundLegendType: 'start' | 'end';
  stats: SummaryStatistics;

  constructor(private summaryDataService: SummaryDataService) { }

  ngOnInit() {
    this.summaryDataService.observeStatistics().subscribe(this.setStatistics.bind(this));
  }

  private setStatistics(stats: SummaryStatistics) {
    if (!stats || !stats.min) {
      this.stats = null;
    } else {
      this.stats = stats;
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
        this.valueField, this.inputField, this.labelField, this.orderField);
    }
  }
  private updateProcessor() {
    this.summaryDataService.updateProcessor(
      this.valueField, this.inputField, this.labelField, this.orderField);
  }
}
