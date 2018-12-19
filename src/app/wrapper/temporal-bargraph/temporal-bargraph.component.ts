import { Component, Input, OnInit } from '@angular/core';
import { mapValues } from 'lodash';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { RawChangeSet } from '@ngx-dino/core';
import dummyData from '../shared/temporal-bargraph/dummy-data';
import * as fields from '../shared/temporal-bargraph/fields';

@Component({
  selector: 'app-temporal-bargraph',
  templateUrl: './temporal-bargraph.component.html',
  styleUrls: ['./temporal-bargraph.component.sass']
})
export class TemporalBargraphComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;

  barStream = interval(500).pipe(
    take(dummyData.length),
    map(index => dummyData[index]),
    map(item => [item]),
    map(RawChangeSet.fromArray)
  );
  fields: any = { };
  spacing = 20;

  constructor() {
    this.fields = mapValues(fields, (f) => f.getBoundField());
  }

  ngOnInit() {
  }

}
