import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Operator, BoundField } from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/static/combine';

import { DataType } from './data-types';


@Injectable()
export class DatatableService {
  constructor() { }

  makeDataSource(
    data: Observable<any[]>, fields: BoundField<DataType>[]
  ): Observable<DataType[][]> {
    const op = Operator.combine<any, any[]>(fields.map((f) => f.operator));
    return data.map((items) => items.map(op.getter));
  }
}