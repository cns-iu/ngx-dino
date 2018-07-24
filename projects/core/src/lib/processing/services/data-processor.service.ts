import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Seq, Map } from 'immutable';

import { BoundField } from '../../fields';
import { DatumId, Datum } from '../datums';
import { RawChangeSet, ChangeSet, CachedChangeStream } from '../changes';
import { DataProcessorConfig, DataProcessor } from '../processors';


// Stream to cache mapping
const cacheMap = Map<Observable<RawChangeSet<any>>, CachedChangeStream<any>>().asMutable();

function getCache<R>(
  stream: Observable<RawChangeSet<R>>,
  bfield: BoundField<DatumId>
): CachedChangeStream<R> {
  let cache = cacheMap.get(stream);
  if (cache === undefined) {
    const newStream = stream.pipe(
      tap({complete: () => cacheMap.delete(stream)}),
      map(ChangeSet.fromRawChangeSet(bfield))
    );
    cache = new CachedChangeStream(newStream);
    cacheMap.set(stream, cache);
  }

  return cache;
}


@Injectable()
export class DataProcessorService {
  constructor() {  }


  createProcessor<T extends Datum<R>, R>(
    stream: Observable<RawChangeSet<R>>,
    bfield: BoundField<DatumId>,
    extracted: {[prop: string]: BoundField<any>} = {},
    computed: {[prop: string]: BoundField<any>} = {},
    config: DataProcessorConfig = {}
  ): DataProcessor<R, T> {
    const rawCache = getCache(stream, bfield);
    const extractedSeq = Seq.Keyed<string, BoundField<any>>(extracted);
    const computedSeq = Seq.Keyed<string, BoundField<any>>(computed);

    return new DataProcessor(rawCache, extractedSeq, computedSeq, config);
  }
}
