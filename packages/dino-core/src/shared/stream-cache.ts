import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { List, Map } from 'immutable';

import { IField } from './field';
import { DatumId, Changes, getDatumId } from './changes';


class Cache<T> {
  private cache = Map<DatumId, T>();

  constructor(public idField: IField<DatumId>) {}

  cacheChanges(changes: Changes<T>): void {
    this.cache = this.cache.withMutations((cache) => {
      changes.add.forEach((datum) => {
        cache.set(getDatumId(datum, this.idField), datum)
      });

      changes.remove.forEach((datum) => {
        cache.delete(getDatumId(datum, this.idField))
      });

      changes.update.forEach(([datumOrId, update]) => {
        cache.update(getDatumId(datumOrId, this.idField), (datum) => {
          return datum !== undefined ? Object.assign(datum, update) : datum;
        });
      });
    });
  }

  emitUpdates(): Changes<T> {
    return new Changes(undefined, undefined, Array.from(this.cache as any));
  }
}

export class StreamCache<T> {
  private readonly changeStream = new Subject<Changes<T>>();
  private readonly cache: Cache<T>;

  get idField() {
    return this.cache.idField;
  }

  set idField(field: IField<DatumId>) {
    this.cache.idField = field;
  }

  constructor(
    idField: IField<DatumId>,
    stream: Observable<Changes<T>>
  ) {
    this.cache = new Cache(idField);
    stream.subscribe(this.processChanges.bind(this));
  }

  asObservable(): Observable<Changes<T>> {
    return this.changeStream.asObservable();
  }

  sendUpdate(): void {
    this.changeStream.next(this.cache.emitUpdates());
  }

  private processChanges(changes: Changes<T>): void {
    this.cache.cacheChanges(changes);
    this.changeStream.next(changes);
  }
}
