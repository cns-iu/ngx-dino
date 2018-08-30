import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
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
    this.nodeStream = this.createDelayedStream(dummyNodeData);
    this.edgeStream = this.createDelayedStream(dummyEdgeData, 1100);
  }

  ngOnInit() {
  }

  activate(): void {
    this.network.resizeSelf();
  }

  private createDelayedStream<T>(data: T[], delay = 0): Observable<RawChangeSet<T>> {
    return timer(delay, 1000).pipe(
      take(data.length),
      map((index) => data[index]),
      map((item) => RawChangeSet.fromArray([item]))
    );
  }
}
