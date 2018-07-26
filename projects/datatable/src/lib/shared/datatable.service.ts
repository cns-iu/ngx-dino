import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  DatumId, BoundField, RawChangeSet, DataProcessorService,
  simpleField, combine
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
    fields: BoundField<DataType>[]
  ): Observable<DataType[][]> {
    const cfield = simpleField({
      label: 'Combined fields',
      operator: combine<any, any[]>(fields.map((f) => f.operator))
    }).getBoundField();
    const processor = this.service.createProcessor(
      stream, idField, {data: cfield}
    );
    return processor.asObservable().pipe(map(() => {
      return processor.processedCache.cache.items.valueSeq().map((datum) => {
        return datum['data'];
      }).toArray();
    }));
  }
}
