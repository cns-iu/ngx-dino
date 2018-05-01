import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';

import { Seq, Map } from 'immutable';

import { BoundField } from '../../fields';
import { DatumId } from '../datum-id';
import { Changes } from '../changes';
import { ChangeCache } from './change-cache';


export class StreamCache<T> {
  private changeCache: ChangeCache<T>;
  private emitStream: Subject<Changes<T>> = new Subject();
  private cacheStream: Observable<Changes<T>>;

  constructor(
    readonly stream: Observable<Changes<T>>,
    field: BoundField<DatumId>
  ) {
    const observedStream = stream.do({
      next: (changes) => (this.changeCache = this.changeCache.update(changes)),
      complete: () => (this.changeCache = new ChangeCache(field))
    });

    this.changeCache = new ChangeCache(field);
    this.cacheStream = Observable.merge(observedStream, this.emitStream);
  }


  // Forward accesses
  get field(): BoundField<DatumId> {
    return this.changeCache.field;
  }

  get map(): Map<DatumId, T> {
    return this.changeCache.map;
  }

  get datums(): Seq.Indexed<T> {
    return this.changeCache.datums;
  }

  setField(field: BoundField<DatumId>): this {
    this.changeCache = this.changeCache.setField(field);
    return this;
  }


  emitUpdate(): this {
    const updates = this.datums.map((d: T): [T, T] => [d, d]).toArray();
    this.emitStream.next(new Changes(undefined, undefined, updates));
    return this;
  }

  clear(): this {
    this.emitStream.next(new Changes(undefined, this.datums.toArray()));
    this.changeCache = new ChangeCache(this.field);
    return this;
  }


  asObservable(): Observable<Changes<T>> {
    return this.cacheStream;
  }
}
