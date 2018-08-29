import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isString } from 'lodash';
import {
  Symbol, SymbolType, symbol as symbolConstructor,
  symbolCircle, symbolCross, symbolDiamond,
  symbolSquare, symbolStar, symbolTriangle, symbolWye
} from 'd3-shape';
import { Point, isPoint } from '../shared/utility';
import { BuiltinSymbolTypes } from '../shared/options';

const builtinLookup: {[P in BuiltinSymbolTypes]: SymbolType} = {
  'circle': symbolCircle, 'cross': symbolCross, 'diamond': symbolDiamond,
  'square': symbolSquare, 'star': symbolStar, 'triangle': symbolTriangle,
  'wye': symbolWye
};

@Component({
  selector: '[dino-network-node]', // tslint:disable-line:component-selector
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnChanges {
  @Input() symbol: BuiltinSymbolTypes | SymbolType = 'circle';
  @Input() position: Point;
  @Input() size: number;
  @Input() color: string = 'black';

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
    return isPoint(position) && size > 0;
  }

  centerTranslate(): string {
    const [x, y] = this.position;
    return `translate(${x},${y})`;
  }

  private getSymbol(): SymbolType {
    const symbol = this.symbol;
    if (isString(symbol)) {
      return builtinLookup[symbol] || builtinLookup['circle'];
    }
    return symbol;
  }
}
