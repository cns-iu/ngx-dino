import { differenceWith, forEach, map, reduce, sortBy, sumBy, throttle, uniq, unzip } from 'lodash';

import { DatumId, idSymbol } from '@ngx-dino/core';
import { extractStyles } from './style';
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

  constructor(readonly item: BarItem) {
    this.style = extractStyles(item);
  }
}

export class Layout {
  get bars(): Bar[] { return this._bars; }
  get tickLabels(): string[] { return this._tickLabels; }

  private _bars: BarImpl[] = [];
  private _tickLabels: string[] = [];
  private domain: any[] = [];
  private height = 0;
  private weightTotal = 0;

  private pending: BarImpl[] = [];
  private readonly recalculate = throttle(this._recalculate, 0, { leading: false });

  setHeight(height: number): this {
    if (height > this.weightTotal) {
      this.recalculate();
    }

    this.height = height;
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

  private calculateLabels(): void {
    const bars = this._bars;
    const starts = map(bars, 'rawStart');
    const ends = map(bars, 'rawEnd');
    const initialDomain = uniq(starts.concat(ends));

    // TODO interpolate domain
    this.domain = initialDomain; // Temporary

    this._tickLabels = map(this.domain, d => d.toString());
  }

  private calculatePositions(): void {
    const bars = this._bars;
    const domain = this.domain;
    const length = domain.length;

    forEach(bars, bar => {
      const startIndex = domain.indexOf(bar.rawStart);
      const endIndex = domain.indexOf(bar.rawEnd);
      bar.start = startIndex / length;
      bar.end = (endIndex + 1) / length;
    });
  }

  private calculateWeights(): void {
    const bars = this._bars;
    const total = this.weightTotal = sumBy(bars, 'rawWeight');
    const max = Math.max(total, .95 * this.height);

    reduce(bars, (currentOffset, bar) => {
      const weight = bar.weight = bar.rawWeight / max;
      const offset = bar.offset = currentOffset - weight;
      return offset;
    }, .95);
  }
}
