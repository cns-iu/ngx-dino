import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  Symbol, SymbolType, symbol as symbolConstructor,
  symbolCircle, symbolCross, symbolDiamond,
  symbolSquare, symbolStar, symbolTriangle, symbolWye
} from 'd3-shape';
import { isString } from 'lodash';

import { BuiltinSymbolTypes } from '../shared/options';
import { Point, isPoint, setDefaultValue } from '../shared/utility';

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
  @Input() transparency = 0;
  @Input() stroke = 'black';
  @Input() strokeWidth = 0;
  @Input() strokeTransparency = 0;
  @Input() tooltip = '';
  @Input() tooltipElement: HTMLDivElement;
  @Input() label = '';
  @Input() labelPosition: LabelPosition = 'top';
  @Input() pulse = false;

  shape: string;
  private symbolGenerator: Symbol<void, void>;

  get labelAnchor(): LabelAnchor { return anchorLookup[this.labelPosition]; }
  get labelBaseline(): LabelBaseline { return baselineLookup[this.labelPosition]; }
  get labelDx(): number { return this.getLabelOffset(['top', 'bottom'], ['right']); }
  get labelDy(): number { return this.getLabelOffset(['left', 'right'], ['bottom']); }

  constructor() {
    const generator = this.symbolGenerator = symbolConstructor();
    generator.type(() => ({
      draw: (context): void => this.getSymbol().draw(context, this.size)
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Set (reset) default values
    setDefaultValue(this, changes, 'symbol', 'circle');
    setDefaultValue(this, changes, 'color', 'black');
    setDefaultValue(this, changes, 'transparency', 0);
    setDefaultValue(this, changes, 'stroke', 'black');
    setDefaultValue(this, changes, 'strokeWidth', 0);
    setDefaultValue(this, changes, 'strokeTransparency', 0);
    setDefaultValue(this, changes, 'tooltip', '');
    setDefaultValue(this, changes, 'label', '');
    setDefaultValue(this, changes, 'labelPosition', 'top');
    setDefaultValue(this, changes, 'pulse', false);

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

  private getLabelOffset(
    zeroes: LabelPosition[], negatives: LabelPosition[]
  ): number {
    const position = this.labelPosition;
    if (zeroes.indexOf(position) >= 0) {
      return 0;
    }

    const offset = Math.sqrt(this.size) / 2 + 3;
    return negatives.indexOf(position) === -1 ? offset : -offset;
  }
}
