import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { mapValues } from 'lodash';
import { RawChangeSet } from '@ngx-dino/core';
import * as fields from '../shared/network/fields';
import { dummyEdgeData, dummyNodeData } from '../shared/network/dummy-data';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.sass']
})
export class NetworkComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;

  @ViewChild('network') network: any;

  nodeStream: Observable<RawChangeSet>;
  edgeStream: Observable<RawChangeSet>;

  fields: fields.Fields = {};

  constructor() {
    this.fields = mapValues(fields, (f) => f.getBoundField());
    this.nodeStream = of(RawChangeSet.fromArray(dummyNodeData)).pipe(delay(10));
    this.edgeStream = of(RawChangeSet.fromArray(dummyEdgeData)).pipe(delay(10));
  }

  ngOnInit() {
  }

  activate(): void {
    this.network.resizeSelf();
  }
}
