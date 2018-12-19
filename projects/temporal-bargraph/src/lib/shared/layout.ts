import {
  concat, differenceWith, forEach, identity, map, reduce,
  sortBy, sortedUniq, sumBy, toString, throttle, unzip
} from 'lodash';

import { DatumId, idSymbol } from '@ngx-dino/core';
import { interpolateNumericDomain } from './domain';
import { extractStyles } from './style';
import { Type, coerceToType, getCoerceFunction, sniffType } from './type-sniffing';
import { Bar, BarItem, LabelPosition } from './types';

class BarImpl implements Bar {
  get rawStart(): any { return this.item.start; }
  get rawEnd(): any { return this.item.end; }
  get rawWeight(): number { return this.item.weight; }
  get stackOrder(): number { return this.item.stackOrder; }

  start = 0;
  end = 0;
  offset = 0;
  weight = 0;
  style: object;

  get label(): string { return this.item.label; }
  get labelPosition(): LabelPosition { return this.item.labelPosition; }

  get tooltip(): string { return this.item.tooltip; }

  constructor(readonly item: BarItem) {
    this.style = extractStyles(item);
  }
}

export class Layout {
  get bars(): Bar[] { return this._bars; }
  get tickLabels(): string[] { return this._tickLabels; }
  get height(): number { return this._height; }

  private _bars: BarImpl[] = [];
  private _tickLabels: string[] = [];
  private domain: any[] = [];
  private domainType: Type;
  private _height = 0;
  private weightTotalWithSpacing = 0;
  private barSpacing = 0;

  private pending: BarImpl[] = [];
  private readonly recalculate = throttle(this._recalculate, 10, { leading: false });

  setHeight(height: number): this {
    if (height > this.weightTotalWithSpacing) {
      this.recalculate();
    }

    this._height = height;
    return this;
  }

  setBarSpacing(spacing = 0): this {
    if (this.barSpacing !== spacing) {
      this.barSpacing = spacing;
      this.recalculate();
    }
    return this;
  }

  addItems(items: BarItem[]): this {
    const bars = map(items, bar => new BarImpl(bar));
    this.pending = this.pending.concat(bars);
    this.recalculate();
    return this;
  }

  removeItems(ids: DatumId[]): this {
    const eqId = (bar: BarImpl, id: DatumId) => bar.item[idSymbol] === id;
    this.pending = differenceWith(this.pending, ids, eqId);
    this.recalculate();
    return this;
  }

  replaceItems(pairs: [DatumId, BarItem][]): this {
    const [ids, items] = unzip(pairs) as [DatumId[], BarItem[]];
    return this.removeItems(ids).addItems(items);
  }

  private _recalculate(): void {
    const sorted = sortBy(this.pending, 'stackOrder');
    this._bars = sorted;
    this.pending = map(sorted, bar => new BarImpl(bar.item));
    this.calculateLabels();
    this.calculatePositions();
    this.calculateWeights();
  }

  // FIXME: Custom sorting
  private calculateLabels(): void {
    const bars = this._bars;
    const domainValues = concat(map(bars, 'rawStart'), map(bars, 'rawEnd'));
    const domainType = sniffType(domainValues);
    const coercedDomain = coerceToType(domainValues, domainType);
    const sortedDomain = sortedUniq(sortBy(coercedDomain));
    const interpolateFun = domainType === Type.Integer || domainType === Type.Number ?
      interpolateNumericDomain : identity;
    const domain = interpolateFun(sortedDomain);

    this.domain = domain;
    this.domainType = domainType;
    this._tickLabels = map(domain, toString);
  }

  private calculatePositions(): void {
    const { _bars: bars, domain, domainType } = this;
    const length = domain.length;
    const coerceFun = getCoerceFunction(domainType);

    forEach(bars, bar => {
      let startIndex = domain.indexOf(coerceFun(bar.rawStart));
      let endIndex = domain.indexOf(coerceFun(bar.rawEnd));
      if (endIndex < startIndex) {
        [startIndex, endIndex] = [endIndex, startIndex];
      }

      bar.start = startIndex / length;
      bar.end = (endIndex + 1) / length;
    });
  }

  private calculateWeights(): void {
    const { _bars: bars, barSpacing: spacing, height } = this;
    const weightTotal = sumBy(bars, 'rawWeight');
    const totalSpacing = spacing * (bars.length - 1);
    const weightTotalWithSpacing = this.weightTotalWithSpacing = weightTotal + totalSpacing;
    const max = Math.max(weightTotalWithSpacing, height);
    const spacingAdjust = spacing / max;

    reduce(bars, (currentOffset, bar, index) => {
      const adjust = index === 0 ? 0 : spacingAdjust;
      const weight = bar.weight = bar.rawWeight / max;
      const offset = bar.offset = currentOffset - weight - adjust;
      return offset;
    }, 1);
  }
}
