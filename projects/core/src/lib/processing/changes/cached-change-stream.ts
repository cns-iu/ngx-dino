import { Observable, Subject, merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ChangeSet } from './change-set';
import { ChangeCache } from './change-cache';


export class CachedChangeStream<R> {
  private emitStream: Subject<ChangeSet<R>> = new Subject();
  public cache: ChangeCache<R>;
  readonly cachedStream: Observable<ChangeSet<R>>;


  constructor(
    readonly stream: Observable<ChangeSet<R>>,
    strictMode?: boolean
  ) {
    this.cache = new ChangeCache(strictMode);
    this.cachedStream = merge(stream.pipe(tap({
      next: (changes) => (this.cache = this.cache.update(changes)),
      complete: () => this.emitStream.complete()
    })), this.emitStream);
  }


  reemit(): void {
    const replace = this.cache.items.valueSeq();
    const changes = new ChangeSet<R>(undefined, undefined, undefined, replace);

    this.emitStream.next(changes);
  }

  clear(): void {
    const remove = this.cache.items.valueSeq();
    const changes = new ChangeSet<R>(undefined, remove);

    this.cache = this.cache.clear();
    this.emitStream.next(changes);
  }


  asObservable(): Observable<ChangeSet<R>> {
    return this.cachedStream;
  }
}
