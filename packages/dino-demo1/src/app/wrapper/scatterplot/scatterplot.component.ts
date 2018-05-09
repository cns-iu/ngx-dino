import { Component, OnInit, Input } from '@angular/core';
import { BoundField } from '@ngx-dino/core';

import {
  pointIdField,

  xField,
  yField,

  sizeField,
  shapeField,
  colorField,
  strokeField
} from '../shared/scatterplot/scatterplot-fields';
import { ScatterplotDataService } from '../shared/scatterplot/scatterplot-data.service';

@Component({
  selector: 'app-scatterplot',
  templateUrl: './scatterplot.component.html',
  styleUrls: ['./scatterplot.component.sass'],
  providers: [ScatterplotDataService]
})
export class ScatterplotComponent implements OnInit {
  @Input() height = window.innerHeight;
  @Input() width = window.innerWidth;
  
  data: any[];

  id: BoundField<string>;

  x: BoundField<number>;
  y: BoundField<number>;

  color: BoundField<string>;
  shape: BoundField<string>;
  size: BoundField<number>;
  stroke: BoundField<string>;

  constructor(private dataService: ScatterplotDataService) { }

  ngOnInit() {
    this.id = pointIdField.getBoundField();
    
    this.x = xField.getBoundField();
    this.y = yField.getBoundField();

    this.shape = shapeField.getBoundField();
    this.size = sizeField.getBoundField();
    this.color = colorField.getBoundField();
    this.stroke = strokeField.getBoundField();

    this.data = this.dataService.data;
  }
}
