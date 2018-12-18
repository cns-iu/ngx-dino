import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Bar } from '../shared/types';

@Component({
  selector: 'dino-bar-group, [dino-bar-group]',
  templateUrl: './bar-group.component.html',
  styleUrls: ['./bar-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarGroupComponent {
  @Input() bars: Bar[];
  @Input() tooltipElement: HTMLDivElement;

  trackByBarOrder(index: number): number { return index; }
}
