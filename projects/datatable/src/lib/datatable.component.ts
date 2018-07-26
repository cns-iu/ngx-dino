import {
  Component, Input, Output,
  OnInit, OnChanges,
  SimpleChanges, EventEmitter
} from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isArray } from 'lodash';

import { DatumId, BoundField, RawChangeSet } from '@ngx-dino/core';
import { DataType } from './shared/data-types';
import { DatatableService } from './shared/datatable.service';


@Component({
  selector: 'dino-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit, OnChanges {
  @Input() dataStream: any[] | Observable<any[]> | Observable<RawChangeSet>;
  @Input() idField: BoundField<DatumId>;
  @Input() fields: BoundField<DataType>[];
  @Output() rowClick: Observable<number> = new EventEmitter();

  dataSource: Observable<DataType[][]>;
  get columns(): string[] {
    return (this.fields || []).map((f) => f.field.label);
  }

  constructor(private service: DatatableService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const props = ['dataStream', 'idField', 'fields'];
    if (props.some((p) => (p in changes)) && props.every((p) => this[p])) {
      const stream = this.normalizeDataStream();
      this.dataSource = this.service.processData(
        stream, this.idField, this.fields
      );
    }
  }

  private normalizeDataStream(): Observable<RawChangeSet> {
    if (isArray(this.dataStream)) {
      return of(this.dataStream).pipe(map(RawChangeSet.fromArray));
    } else {
      return (this.dataStream as Observable<any>).pipe(map((data) => {
        return isArray(data) ? RawChangeSet.fromArray(data) : data;
      }));
    }
  }
}
