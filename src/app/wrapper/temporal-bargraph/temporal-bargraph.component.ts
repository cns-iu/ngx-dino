import { Component, Input, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-temporal-bargraph',
  templateUrl: './temporal-bargraph.component.html',
  styleUrls: ['./temporal-bargraph.component.sass']
})
export class TemporalBargraphComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;

  empty = EMPTY;
  constructor() { }

  ngOnInit() {
  }

}
