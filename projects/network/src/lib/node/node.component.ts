import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { isString } from 'lodash';
import {
  Symbol, SymbolType, symbol as symbolConstructor,
  symbolCircle, symbolCross, symbolDiamond,
  symbolSquare, symbolStar, symbolTriangle, symbolWye
} from 'd3-shape';
import { Point, isPoint } from '../shared/utility';
import { BuiltinSymbolTypes } from '../shared/options';

export type LabelPosition = 'left' | 'right' | 'top' | 'bottom' | 'center';
type LabelAnchor = 'start' | 'middle' | 'end';
type LabelBaseline = 'baseline' | 'middle' | 'hanging';

const builtinLookup: {[P in BuiltinSymbolTypes]: SymbolType} = {
  'circle': symbolCircle, 'cross': symbolCross, 'diamond': symbolDiamond,
  'square': symbolSquare, 'star': symbolStar, 'triangle': symbolTriangle,
  'wye': symbolWye
};

const anchorLookup: { [P in LabelPosition]: LabelAnchor } = {
  'left': 'end', 'right': 'start', 'top': 'middle', 'bottom': 'middle', 'center': 'middle'
};

const baselineLookup: { [P in LabelPosition]: LabelBaseline } = {
  'left': 'middle', 'right': 'middle', 'top': 'baseline', 'bottom': 'hanging', 'center': 'middle'
};

@Component({
  selector: '[dino-network-node]', // tslint:disable-line:component-selector
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeComponent implements OnChanges {
  @Input() symbol: BuiltinSymbolTypes | SymbolType = 'circle';
  @Input() position: Point;
  @Input() size: number;
  @Input() color = 'black';
  @Input() stroke = 'black';
  @Input() transparency;
  @Input() strokeWidth = 0;
  @Input() tooltip = '';
  @Input() tooltipElement: HTMLDivElement;
  @Input() label = '';
  @Input() labelPosition: LabelPosition = 'top';
  @Input() strokeTransparency;

  shape: string;
  private symbolGenerator: Symbol<void, void>;

  get labelAnchor(): LabelAnchor {
    return anchorLookup[this.labelPosition];
  }
  get labelBaseline(): LabelBaseline {
    return baselineLookup[this.labelPosition];
  }
  get labelDx(): number {
    if (this.labelPosition === 'top' || this.labelPosition === 'bottom') {
      return 0;
    }

    const offset = Math.sqrt(this.size) / 2 + 3;
    return this.labelPosition === 'right' ? offset : -offset;
  }
  get labelDy(): number {
    if (this.labelPosition === 'left' || this.labelPosition === 'right') {
      return 0;
    }

    const offset = Math.sqrt(this.size) / 2 + 3;
    return this.labelPosition === 'bottom' ? offset : -offset;
  }

  constructor() {
    const generator = this.symbolGenerator = symbolConstructor();
    generator.type(() => this.getSymbol());
    generator.size(() => this.size);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('symbol' in changes || 'size' in changes) {
      if (this.isValid()) {
        this.shape = this.symbolGenerator();
      }
    }
  }

  isValid(): boolean {
    const { position, size } = this;
    return isPoint(position) && size > 0;
  }

  hasLabel(): boolean {
    const { label, labelPosition } = this;
    return !!label && !!anchorLookup[labelPosition];
  }

  centerTranslate(): string {
    const [x, y] = this.position;
    return `translate(${x},${y})`;
  }

  showTooltip(event: any): void {
    const el = this.tooltipElement;
    const { x, y } = event;
    if (!el || !this.tooltip) {
      return;
    }

    el.textContent = this.tooltip;
    el.style.left = `${x - 40}px`;
    el.style.top = `${y - 40}px`;
    el.style.visibility = 'visible';
  }

  hideTooltip(): void {
    const el = this.tooltipElement;
    if (!el) {
      return;
    }

    el.style.visibility = 'hidden';
  }

  private getSymbol(): SymbolType {
    const symbol = this.symbol;
    if (isString(symbol)) {
      return builtinLookup[symbol] || builtinLookup['circle'];
    }
    return symbol;
  }
}
