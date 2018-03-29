import {
  Component, Input,
  OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BoundField } from '@ngx-dino/core';

import { DatatableService } from '../shared/datatable.service';


@Component({
  selector: 'dino-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.sass']
})
export class DatatableComponent implements OnInit, OnChanges {
  @Input() data: Observable<any[]>;
  @Input() fields: BoundField<any>[];

  dataSource: Observable<any[][]>;
  get columns(): string[] {
    return this.fields.map((f) => f.field.label);
  }

  constructor(private service: DatatableService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = this.service.makeDataSource(this.data, this.fields);
  }
}
