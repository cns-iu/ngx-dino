import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { Collection, Seq, Map } from 'immutable';
import { bind, defaults } from 'lodash';

import { BoundField } from '../../fields';
import { DatumId, Datum, idSymbol, rawDataSymbol } from '../datums';
import { ChangeSet, CachedChangeStream } from '../changes';
import { DatumProcessor } from './datum-processor';


export interface DataProcessorConfig {
  create?: <R, T extends Datum<R>>(id: DatumId, rawData: R) => T;
}


function defaultCreate<R, T extends Datum<R>>(id: DatumId, rawData: R): T {
  return new Datum(id, rawData) as T;
}


export class DataProcessor<R, T extends Datum<R>> {
  private emitStream: Subject<ChangeSet<R>> = new Subject();
  public datumProcessor: DatumProcessor<R, T>;
  readonly processedCache: CachedChangeStream<R>;
  readonly config: DataProcessorConfig;


  constructor(
    readonly rawCache: CachedChangeStream<R>,
    extracted: Collection.Keyed<string, BoundField<any>> = Seq.Keyed(),
    computed: Collection.Keyed<string, BoundField<any>> = Seq.Keyed(),
    config: DataProcessorConfig = {}
  ) {
    this.datumProcessor = new DatumProcessor(extracted, computed);
    this.config = defaults({}, config, {
      create: defaultCreate
    });

    const boundProcessChanges = bind(this.processChanges, this);
    const processedStream = rawCache.asObservable().map(boundProcessChanges);
    this.processedCache = new CachedChangeStream(Observable.merge(
      processedStream, this.emitStream
    ));
  }


  updateFields(
    extracted: Collection.Keyed<string, BoundField<any>> = Seq.Keyed(),
    computed: Collection.Keyed<string, BoundField<any>> = Seq.Keyed()
  ): this {
    const newExtracted = Map<string, BoundField<any>>().merge(
      this.datumProcessor.extracted, extracted
    );
    const newComputed = Map<string, BoundField<any>>().merge(
      this.datumProcessor.computed, computed
    );
    const changes = new ChangeSet<R>(this.rawCache.cache.items.valueSeq());

    this.datumProcessor = new DatumProcessor(newExtracted, newComputed);
    this.processedCache.clear();
    this.emitStream.next(changes);

    return this;
  }


  asObservable(): Observable<ChangeSet<R>> {
    return this.processedCache.asObservable();
  }


  // Processing utility
  private processChanges(changes: ChangeSet<R>): ChangeSet<R> {
    const insert = this.processInsert(changes.insert);
    const remove = this.processRemove(changes.remove);
    const update = this.processUpdate(changes.update);
    const replace = this.processReplace(changes.replace);

    return new ChangeSet(
      insert, remove, undefined, replace.concat(update).toIndexedSeq()
    );
  }

  private processInsert(
    insert: Collection.Indexed<Datum<R>>
  ): Collection.Indexed<T> {
    const boundProcessDatum = bind(this.processDatum, this);
    return insert.map(boundProcessDatum).toIndexedSeq();
  }

  private processRemove(
    remove: Collection.Indexed<Datum<any>>
  ): Collection.Indexed<Datum<any>> {
    return remove;
  }

  private processUpdate(
    update: Collection.Indexed<Datum<Partial<R>>>
  ): Collection.Indexed<Datum<R>> {
    const items = this.rawCache.cache.items;
    return update.map((datum) => {
      const id = datum[idSymbol];
      const rawDatum = items.get(id);
      return this.processDatum(rawDatum);
    }).toIndexedSeq();
  }

  private processReplace(
    replace: Collection.Indexed<Datum<R>>
  ): Collection.Indexed<Datum<R>> {
    const boundProcessDatum = bind(this.processDatum, this);
    return replace.map(boundProcessDatum).toIndexedSeq();
  }

  private processDatum(rawDatum: Datum<R>): Datum<R> {
    const id = rawDatum[idSymbol];
    const rawData = rawDatum[rawDataSymbol];
    const datum = this.config.create<R, T>(id, rawData);

    return this.datumProcessor.process(datum);
  }
}
