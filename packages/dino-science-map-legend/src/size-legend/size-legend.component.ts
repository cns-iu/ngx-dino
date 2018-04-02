import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import  { Observable } from 'rxjs/Observable';
import { BoundField } from '@ngx-dino/core';

@Component({
  selector: 'science-map-size-legend',
  templateUrl: './size-legend.component.html',
  styleUrls: ['./size-legend.component.sass'],
  providers: []
})
export class SizeLegendComponent implements OnInit {
  @Input() dataStream: Observable<any>;
  @Input() sizeField: BoundField<string | number>;
   
  constructor() { }

  ngOnInit() { }
}