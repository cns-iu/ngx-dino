import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  DatumId, BoundField, RawChangeSet, DataProcessorService,
  simpleField, combine, idSymbol
} from '@ngx-dino/core';
import { DataType } from './data-types';


@Injectable({
  providedIn: 'root'
})
export class DatatableService {
  constructor(private service: DataProcessorService) { }

  processData(
    stream: Observable<RawChangeSet>,
    idField: BoundField<DatumId>,
    fields: BoundField<DataType>[],
    sort: boolean | ((a: DatumId, b: DatumId) => number) = false
  ): Observable<DataType[][]> {
    const cfield = simpleField({
      label: 'Combined fields',
      operator: combine<any, any[]>(fields.map((f) => f.operator))
    }).getBoundField();
    const processor = this.service.createProcessor(
      stream, idField, {data: cfield}
    );
    return processor.asObservable().pipe(map(() => {
      let values = processor.processedCache.cache.items.valueSeq();
      if (sort === true) {
        values = values.sort().valueSeq();
      } else if (sort) {
        values = values.sort((a, b) => sort(a[idSymbol], b[idSymbol])).valueSeq();
      }
      return values.map((datum) => datum['data']).toArray();
    }));
  }
}
