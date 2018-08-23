import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { mapValues } from 'lodash';
import { RawChangeSet } from '@ngx-dino/core';
import * as fields from '../shared/network/fields';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.sass']
})
export class NetworkComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;

  nodeStream: Observable<RawChangeSet>;
  edgeStream: Observable<RawChangeSet>;

  fields: fields.Fields = {};

  constructor() {
    this.fields = mapValues(fields, (f) => f.getBoundField());
  }

  ngOnInit() {
  }
}
