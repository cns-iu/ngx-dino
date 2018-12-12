import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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
  @Input() ticks: string[];
  tickLabels: Tick[] = [];
  tickLines: string[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('ticks' in changes) {
      this.updateTickLabels();
      this.updateTickLines();
    }
  }

  trackByLabel(_index: number, tick: Tick): string {
    return tick.label;
  }

  private updateTickLabels(): void {
    const { ticks } = this;
    const length = ticks && ticks.length;
    if (!length) {
      this.tickLabels = [];
      return;
    }

    this.tickLabels = ticks.map((label, index) => ({
      label, offset: this.getTickLabelOffset(index, length)
    }));
  }

  private updateTickLines(): void {
    const { ticks } = this;
    const length = ticks && ticks.length;
    if (!length) {
      this.tickLines = [];
      return;
    }

    this.tickLines = ticks.map((_unused, index) => this.getTickLineOffset(index, length));
    this.tickLines.push(this.getTickLineOffset(length, length));
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
