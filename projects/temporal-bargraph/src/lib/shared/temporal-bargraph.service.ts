import { Injectable } from '@angular/core';
import { Map } from 'immutable';
import { Observable, Subject, Subscription } from 'rxjs';

import { BoundField, DataProcessor, DataProcessorService, DatumId, RawChangeSet } from '@ngx-dino/core';
import { Point } from '@ngx-dino/network';

@Injectable({
  providedIn: 'root'
})
export class TemporalBargraphService {
  private barProcessor: DataProcessor<any, any>;
  private barSubscription: Subscription;

  private readonly _rangeChange = new Subject<[[number, number], [number, number]]>();
  readonly rangeChange = this._rangeChange.asObservable();

  constructor(private processorService: DataProcessorService) { }

  fetchBars(
    stream: Observable<RawChangeSet>,
    id: BoundField<DatumId>,
    position: BoundField<Point>,
    width: BoundField<number>,
    height: BoundField<number>
  ): this {
    if (this.barSubscription) {
      this.barSubscription.unsubscribe();
    }

    this.barProcessor = this.processorService.createProcessor(stream, id, {
      position, width, height
    });
    this.barSubscription = this.barProcessor.asObservable().subscribe(() => {
      const items = this.barProcessor.processedCache.cache.items;
      const [xMin, xMax] = items.reduce(([min, max], item: any) => {
        const { position: [x], width: w } = item;
        return [Math.min(min, x - w / 2), Math.max(max, x + w / 2)];
      }, [Infinity, -Infinity]);
      const [yMin, yMax] = items.reduce(([min, max], item: any) => {
        const { position: [, y], height: h } = item;
        return [Math.min(min, y - h / 2), Math.max(max, y + h / 2)];
      }, [Infinity, -Infinity]);

      this._rangeChange.next([[xMin, xMax], [yMin - 10, yMax + 10]]);
    });

    return this;
  }

  updateBars(
    position?: BoundField<Point>,
    width?: BoundField<number>,
    height?: BoundField<number>
  ): this {
    const fields = Map<string, BoundField<any>>({
      position, width, height
    }).filter((f) => !!f).toKeyedSeq();
    this.barProcessor.updateFields(fields);
    return this;
  }
}
