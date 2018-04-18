import {
  Component, Input, Output,
  OnInit, OnChanges,
  SimpleChanges, EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { BoundField } from '@ngx-dino/core';

import { DataType } from '../shared/data-types';
import { DatatableService } from '../shared/datatable.service';


@Component({
  selector: 'dino-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.sass']
})
export class DatatableComponent implements OnInit, OnChanges {
  @Input() data: any[] | Observable<any[]>;
  @Input() fields: BoundField<DataType>[];
  @Output() rowClick: Observable<number> = new EventEmitter();

  dataSource: Observable<DataType[][]>;
  get columns(): string[] {
    return this.fields.map((f) => f.field.label);
  }

  constructor(private service: DatatableService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data !== undefined) {
      this.updateDataSource();
    }
  }

  private updateDataSource(): void {
    let dataObservable: Observable<any[]>;

    if (this.data instanceof Observable) {
      dataObservable = this.data;
    } else {
      dataObservable = Observable.of(this.data || []);
    }

    this.dataSource = this.service.makeDataSource(dataObservable, this.fields);
  }
}
