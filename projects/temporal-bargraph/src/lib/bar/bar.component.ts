import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Bar, LabelPosition } from '../shared/types';

function formatPercentage(percentage: number): string {
  return `${(100 * percentage).toFixed(2)}%`;
}

function enableLabelPositionClass(position: LabelPosition = 'center'): object {
  const classes = ['top', 'bottom', 'left', 'right', 'center'].reduce((obj, cls) => {
    obj['bar-label-' + cls] = false;
    return obj;
  }, {});

  classes['bar-label-' + position] = true;
  return classes;
}

@Component({
  selector: '[dino-bar]', // tslint:disable-line:component-selector
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarComponent {
  @Input() data: Bar;

  get x(): string { return formatPercentage(this.data.start); }
  get y(): string { return formatPercentage(this.data.offset); }
  get width(): string { return formatPercentage(this.data.end - this.data.start); }
  get height(): string { return formatPercentage(this.data.weight); }
  get style(): object { return this.data.style; }

  get label(): string { return this.data.label; }
  get labelClasses(): any { return enableLabelPositionClass(this.data.labelPosition); }
  get labelX(): string { return formatPercentage(this.getLabelXOffset()); }
  get labelY(): string { return formatPercentage(this.getLabelYOffset()); }

  getLabelXOffset(): number {
    const { data: { start, end } } = this;
    switch (this.data.labelPosition) {
      case 'left': return start;
      case 'right': return end;
      default: return start + (end - start) / 2;
    }
  }

  getLabelYOffset(): number {
    const { data: { weight, offset } } = this;
    switch (this.data.labelPosition) {
      case 'top': return offset;
      case 'bottom': return offset + weight;
      default: return offset + weight / 2;
    }
  }
}
