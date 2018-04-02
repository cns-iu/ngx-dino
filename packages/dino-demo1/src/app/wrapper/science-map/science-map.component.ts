import { Component, OnInit } from '@angular/core';
import { BoundField } from '@ngx-dino/core'
import { subdisciplineSizeField, subdisciplineIDField } from '../shared/science-map-fields';

@Component({
  selector: 'app-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.sass']
})
export class ScienceMapComponent implements OnInit {
  subdisciplineSize: BoundField<string>;
  subdisciplineID: BoundField<number|string>;

  constructor() { }

  ngOnInit() {
    // not user facing
    this.subdisciplineSize = subdisciplineSizeField.getBoundField('size');
    this.subdisciplineID = subdisciplineIDField.getBoundField('id');
  }

}
