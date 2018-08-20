import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CoordinateSpaceOptions } from './options';

@Component({
  selector: 'dino-network',
  templateUrl: 'ntework.component.html',
  styleUrls: ['network.component.css']
})
export class NetworkComponent implements OnChanges, OnInit {
  @Input() coordinateSpaceOptions: CoordinateSpaceOptions;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // TODO
  }
}
