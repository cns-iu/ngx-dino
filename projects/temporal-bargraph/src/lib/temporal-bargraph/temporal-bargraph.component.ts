import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { BoundField, DatumId, RawChangeSet } from '@ngx-dino/core';

@Component({
  selector: 'dino-temporal-bargraph',
  templateUrl: './temporal-bargraph.component.html',
  styleUrls: ['./temporal-bargraph.component.css']
})
export class TemporalBargraphComponent implements OnInit, OnChanges {
  @Input() barStream: Observable<RawChangeSet>;
  @Input() barIdField: BoundField<DatumId>;
  @Input() barStartField: BoundField<any>;
  @Input() barEndField: BoundField<any>;
  @Input() barWeightField: BoundField<number>;

  ticks: string[] = [];
  // TODO ticks

  constructor() { console.log(this); }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void { }

  onResize(bounds: { width: number, height: number }): void {
    // TODO
  }
}
