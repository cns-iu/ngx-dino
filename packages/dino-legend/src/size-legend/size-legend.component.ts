import {
  Component,
  OnInit,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import * as d3Selection from 'd3-selection';
import * as d3Array from 'd3-array';
import { scaleLinear } from 'd3-scale';
import 'd3-transition';

import  { Observable } from 'rxjs/Observable';
import { BoundField } from '@ngx-dino/core';

@Component({
  selector: 'size-legend',
  templateUrl: './size-legend.component.html',
  styleUrls: ['./size-legend.component.sass'],
  providers: []
})
export class SizeLegendComponent implements OnInit, OnChanges {
  @Input() dataStream: any[];
  @Input() sizeField: BoundField<string>;
  @Input() title: string = 'Weighted Journal Score';
  parentNativeElement: any;
  legendSizeScale: any;
  defaultSizeRange = [4, 14];
  max: number;
  mid: number;
  min: number;
  maxLabel: string;
  midLabel: string;
  minLabel: string;

  constructor(element: ElementRef) {
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
      if ('dataStream' in changes && this.dataStream) {
        const values = changes['dataStream'].currentValue;
        this.max = Math.round(parseInt(d3Array.max(values, (d: any) => this.sizeField.get(d))));
        this.min = Math.round(parseInt(d3Array.min(values, (d: any) => this.sizeField.get(d))));
        this.mid = Math.round((this.max + this.min) / 2);
        this.maxLabel = (!isNaN(this.max))? this.max.toString(): '';
        this.midLabel = (!isNaN(this.mid))? this.mid.toString(): '';
        this.minLabel = (!isNaN(this.min))? this.min.toString(): '';
        this.setScales();
        this.setSizes();
        this.setTexts();
      }

    if ('title' in changes) {
      d3Selection.select(this.parentNativeElement)
        .select('#title').transition().text(this.title);
    }
  }

  setScales() {
    this.legendSizeScale = scaleLinear()
      .domain([this.min, this.max])
      .range(this.defaultSizeRange);
  }

  setSizes() {
    d3Selection.select(this.parentNativeElement)
      .select('#maxNode').transition().attr('r', this.legendSizeScale(this.max));

    d3Selection.select(this.parentNativeElement)
      .select('#midNode').transition().attr('r', this.legendSizeScale(this.mid));

      d3Selection.select(this.parentNativeElement)
      .select('#minNode').transition().attr('r', this.legendSizeScale(this.min));
  }

  setTexts() {
    d3Selection.select(this.parentNativeElement)
      .select('#title').transition().text(this.title);

    d3Selection.select(this.parentNativeElement)
      .select('#maxG').select('text').transition().text(this.maxLabel);

    d3Selection.select(this.parentNativeElement)
      .select('#midG').select('text').transition().text(this.midLabel);

    d3Selection.select(this.parentNativeElement)
      .select('#minG').select('text').transition().text(this.minLabel);
  }
}