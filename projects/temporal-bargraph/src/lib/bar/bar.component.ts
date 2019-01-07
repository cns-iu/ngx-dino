import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { truncate } from 'lodash';

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
  @Input() labelMaxLength: number;
  @Input() tooltipElement: HTMLDivElement;

  get x(): string { return formatPercentage(this.data.start); }
  get y(): string { return formatPercentage(this.data.offset); }
  get width(): string { return formatPercentage(this.data.end - this.data.start); }
  get height(): string { return formatPercentage(this.data.weight); }
  get style(): object { return this.data.style; }

  get label(): string { return this.data.label; }
  get truncatedLabel(): string { return truncate(this.label, { length: this.labelMaxLength }); }
  get labelPosition(): LabelPosition { return this.data.labelPosition; }
  get labelClasses(): any { return enableLabelPositionClass(this.data.labelPosition); }
  get labelX(): string { return formatPercentage(this.getLabelXOffset()); }
  get labelY(): string { return formatPercentage(this.getLabelYOffset()); }

  // NOTE: Assumes label !== undefined
  shouldTruncateLabel(): boolean {
    const truncPositions = ['left', 'right'];
    const { label: { length }, labelMaxLength: maxLength, labelPosition: position } = this;
    return maxLength !== undefined && length > maxLength && truncPositions.indexOf(position) !== -1;
  }

  getLabelXOffset(): number {
    const { data: { start, end } } = this;
    switch (this.labelPosition) {
      case 'left': return start;
      case 'right': return end;
      default: return start + (end - start) / 2;
    }
  }

  getLabelYOffset(): number {
    const { data: { weight, offset } } = this;
    switch (this.labelPosition) {
      case 'top': return offset;
      case 'bottom': return offset + weight;
      default: return offset + weight / 2;
    }
  }

  showTooltip(event: any): void { this.showTooltipImpl(event, this.data.tooltip); }
  showLabelTooltip(event: any): void {
    if (this.shouldTruncateLabel()) { this.showTooltipImpl(event, this.label); }
  }

  hideTooltip(): void {
    const el = this.tooltipElement;
    if (el) { el.style.visibility = 'hidden'; }
  }

  private showTooltipImpl(event: any, text: string): void {
    const el = this.tooltipElement;
    const { x, y } = event;
    if (el && text) {
      el.textContent = text;
      el.style.left = `${x}px`;
      el.style.top = `${y - 40}px`;
      el.style.visibility = 'visible';
    }
  }
}
