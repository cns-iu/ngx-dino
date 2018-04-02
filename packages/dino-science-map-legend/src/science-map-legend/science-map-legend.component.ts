import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Observable } from 'rxjs/Observable';

import { BoundField } from '@ngx-dino/core';

@Component({
  selector: 'dino-science-map-legend',
  templateUrl: './science-map-legend.component.html',
  styleUrls: ['./science-map-legend.component.sass'],
  providers: [],
  animations: [
    trigger('disciplineLegendState', [
      state('inactive', style({
        display: 'none',
        bottom: '0px'
      })),
      state('active',   style({
        display: 'block',
        'margin-top': '-166px'
      })),
      transition('inactive => active', animate('60ms ease-in')),
      transition('active => inactive', animate('60ms ease-out'))
    ]),
    trigger('buttonState', [
      state('inactive', style({
        bottom: '0px'
      })),
      state('active',   style({
        'margin-top': '-206px'
      })),
      transition('inactive => active', animate('60ms ease-in')),
      transition('active => inactive', animate('60ms ease-out'))
    ])
  ]
})
export class ScienceMapLegendComponent implements OnInit {
  @Input() dataStream:Observable<any>; // TODO
  @Input() sizeField: BoundField<string>;
  // legendImagePath = '/assets/discipline-legend.svg';

  legendState = 'inactive';
  buttonState = 'inactive';
  constructor() {
  }

  ngOnInit() {
  }

  toggleLegend() {
    this.legendState = this.legendState === 'active' ? 'inactive' : 'active';
    this.buttonState = this.buttonState === 'active' ? 'inactive' : 'active';
  }
}