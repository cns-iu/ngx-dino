import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { get, times } from 'lodash';

export interface Tick {
  label: string;
  offset: string;
}

@Component({
  selector: 'dino-tick-marks, [dino-tick-marks]',
  templateUrl: './tick-marks.component.html',
  styleUrls: ['./tick-marks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickMarksComponent implements OnChanges {
  @Input() tickLabels: string[];
  ticks: Tick[] = [];
  tickLines: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if ('tickLabels' in changes) {
      this.updateTicks();
      this.updateTickLines();
    }
  }

  trackByLabel(_index: number, tick: Tick): string {
    return tick.label;
  }

  private updateTicks(): void {
    const { tickLabels } = this;
    const length = get(tickLabels, 'length', 0);
    this.ticks = times(length, index => ({
      label: tickLabels[index], offset: this.getTickLabelOffset(index, length)
    }));
  }

  private updateTickLines(): void {
    const { tickLabels } = this;
    const length = get(tickLabels, 'length', 0);
    this.tickLines = length > 0 ? times(length + 1, index => this.getTickLineOffset(index, length)) : [];
  }

  // Assumes length > 0
  private getTickLabelOffset(index: number, length: number): string {
    const offset = 100 * (index + 0.5) / length;
    return `${offset.toFixed(2)}%`;
  }

  // Assumes length > 0
  private getTickLineOffset(index: number, length: number): string {
    const offset = 100 * index / length;
    return `${offset.toFixed(2)}%`;
  }
}
