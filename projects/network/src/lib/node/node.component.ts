import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isString } from 'lodash';
import {
  Symbol, SymbolType, symbol as symbolConstructor,
  symbolCircle, symbolCross, symbolDiamond,
  symbolSquare, symbolStar, symbolTriangle, symbolWye
} from 'd3-shape';
import { Point, isPoint } from '../shared/utility';

export type BuiltinSymbolTypes =
  'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';

const builtinLookup: {[P in BuiltinSymbolTypes]: SymbolType} = {
  'circle': symbolCircle, 'cross': symbolCross, 'diamond': symbolDiamond,
  'square': symbolSquare, 'star': symbolStar, 'triangle': symbolTriangle,
  'wye': symbolWye
};

@Component({
  selector: 'dino-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnChanges {
  @Input() symbol: BuiltinSymbolTypes | SymbolType;
  @Input() position: Point;
  @Input() size: number;

  shape: string;
  private symbolGenerator: Symbol<void, void>;

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
    return (
      isPoint(this.position) &&
      this.getSymbol() !== undefined &&
      size > 0
    );
  }

  centerTranslate(): string {
    const [x, y] = this.position;
    return `translate(${x},${y})`;
  }

  private getSymbol(): SymbolType {
    const symbol = this.symbol;
    return isString(symbol) ? builtinLookup[symbol] : symbol;
  }
}
