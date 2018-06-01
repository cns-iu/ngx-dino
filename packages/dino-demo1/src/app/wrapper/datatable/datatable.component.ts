import { Component, OnInit } from '@angular/core';

import { simpleField } from '@ngx-dino/core';
import { access } from '@ngx-dino/core/src/operators/methods/extracting/access';


@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.sass']
})
export class DatatableComponent implements OnInit {
  data = Array(10).fill(0).map((_, index) => {
    return {id: index, v1: 2 * index, v2: index / 2};
  });

  idField = simpleField({
    label: 'Id', operator: access('id')
  }).getBoundField();

  fields = [
    simpleField({label: 'F1', operator: access('v1')}).getBoundField(),
    simpleField({label: 'F2', operator: access('v2')}).getBoundField()
  ];


  constructor() { }

  ngOnInit() {
  }
}
