import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import { Map } from 'immutable';

import * as d3Selection from 'd3-selection';

@Component({
  selector: 'color-legend',
  templateUrl: './color-legend.component.html',
  styleUrls: ['./color-legend.component.sass']
})
export class ColorLegendComponent implements OnInit, OnChanges {
  @Input() shape: string;
  @Input() colorEncodingTitle: string;
  @Input() labelToColor: Map<string, string>;

  private viewBox: string;
  private colorEncodings: any[] = [];

  private labelTransforms = [
    'matrix(1 0 0 1 628.31 76.0977)', 
    'matrix(1 0 0 1 628.31 114.2227)',
    'matrix(1 0 0 1 628.31 150.2227)',
    'matrix(1 0 0 1 628.31 187.2227)',
    'matrix(1 0 0 1 628.31 224.2227)',
    'matrix(1 0 0 1 628.31 261.2227)',
    'matrix(1 0 0 1 628.31 298.2227)',
    'matrix(1 0 0 1 628.31 340.2227)',

    'matrix(1 0 0 1 1019.31 72.8896)',
    'matrix(1 0 0 1 1019.31 112.2227)',
    'matrix(1 0 0 1 1019.31 149.2227)',
    'matrix(1 0 0 1 1019.31 191.5625)',
    'matrix(1 0 0 1 1019.31 233.6875)',
    'matrix(1 0 0 1 1019.31 273.9375)',
    'matrix(1 0 0 1 1019.31 315.2227)'
  ];

  colorRectPositions = [
    {x: 584, y: 54.9, class: 'color0'},
    {x: 584, y: 93.1, class: 'color1'},
    {x: 584, y: 129.1, class: 'color2'},
    {x: 584, y: 167.1, class: 'color3'},
    {x: 584, y: 205.2, class: 'color4'},
    {x: 584, y: 243.2, class: 'color5'},
    {x: 584, y: 281.2, class: 'color6'},
    {x: 584, y: 319.2, class: 'color7'},

    {x: 984.2, y: 53.7, class: 'color8'},
    {x: 984.2, y: 91.7, class: 'color9'},
    {x: 984.2, y: 129, class: 'color10'},
    {x: 984.2, y: 170.9, class: 'color11'},
    {x: 984.2, y: 213, class: 'color12'},
    {x: 984.2, y: 254.1, class: 'color13'},
    {x: 984.2, y: 294.2, class: 'color14'}
  ];

  rects = this.colorRectPositions; // this will be a subset based on # of categories < 15

  viewBoxParams = [565, 20, 1137, 49]; // for color svg

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if('labelToColor' in changes) {
      const entries = changes.labelToColor.currentValue.entrySeq().toArray();
      const length = entries.length;

      if(length < Math.round(this.colorRectPositions.length / 2)) {
        // re-allocating height based on # of categories
        this.viewBoxParams[3] = this.viewBoxParams[3] * length;
        this.viewBox = this.viewBoxParams.toString(); 
      } else {
        this.viewBoxParams[3] = this.viewBoxParams[3] * Math.round(this.colorRectPositions.length / 2);
        this.viewBox = this.viewBoxParams.toString();
      }
      
      this.rects = this.colorRectPositions.slice(0, length);
      
      for (let i=0; i < length; i++) {
        this.colorEncodings[i] = {
          label: entries[i][0],
          transform: this.labelTransforms[i]
        };
        this.rects[i]['color'] = entries[i][1];
      }
    }
  }
}