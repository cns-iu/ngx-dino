import { Component, OnInit, Input } from '@angular/core';
import { BoundField, RawChangeSet } from '@ngx-dino/core';

import { Observable } from 'rxjs/Observable';

import {
  pointIdField,

  xField,
  yField,

  sizeField,
  shapeField,
  colorField,
  strokeField,
  tooltipTextField
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
  
  data: Observable<RawChangeSet<any>>;

  id: BoundField<string>;

  x: BoundField<number>;
  y: BoundField<number>;

  color: BoundField<string>;
  shape: BoundField<string>;
  size: BoundField<number>;
  stroke: BoundField<string>;

  tooltipText: BoundField<number | string>;
  enableTooltip = true;

  constructor(private dataService: ScatterplotDataService) { 
    this.data = this.dataService.data;
  }

  ngOnInit() {
    this.id = pointIdField.getBoundField();
    
    this.x = xField.getBoundField();
    this.y = yField.getBoundField();

    this.shape = shapeField.getBoundField();
    this.size = sizeField.getBoundField();
    this.color = colorField.getBoundField();
    this.stroke = strokeField.getBoundField();

    this.tooltipText = tooltipTextField.getBoundField();
  }
}
