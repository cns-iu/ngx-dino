import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Operator, BoundField } from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/static/combine';


@Injectable()
export class DatatableService {
  constructor() { }

  makeDataSource(
    data: Observable<any[]>, fields: BoundField<any>[]
  ): Observable<any[][]> {
    const op = Operator.combine<any, any[]>(fields.map((f) => f.operator));
    return data.map((items) => items.map(op.getter));
  }
}
