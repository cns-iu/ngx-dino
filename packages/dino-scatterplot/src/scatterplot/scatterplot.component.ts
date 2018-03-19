import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  Input,
  Output,
  SimpleChanges,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as d3Axis from 'd3-axis';
import * as d3Selection from 'd3-selection';
import 'd3-transition'; // This adds transition support to d3-selection
import * as d3Array from 'd3-array';
import {
  scaleLinear, scaleOrdinal, scalePow, scaleTime, scalePoint
} from 'd3-scale';
import * as d3Shape from 'd3-shape';

import { Changes, IField, StreamCache } from '@ngx-dino/core';
import { ScatterplotDataService } from '../shared/scatterplot-data.service';
import { Point } from '../shared/point';

@Component({
  selector: 'dino-scatterplot',
  templateUrl: './scatterplot.component.html',
  styleUrls: ['./scatterplot.component.sass'],
  providers: [ScatterplotDataService]
})
export class ScatterplotComponent implements OnInit, OnChanges {
  @Input() pointIDField: IField<string>;
  @Input() showPersonaField: IField<boolean>;
  @Input() xField: IField<number | string>;
  @Input() yField: IField<number | string>;
  @Input() dataStream: Observable<Changes<any>>;
  @Input() colorField: IField<string>;
  @Input() shapeField: IField<string>;
  @Input() sizeField: IField<string>;

  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };

  // Temporary change so that Geomap and Scatterplot are the same size.
  @Input() svgWidth = 955 - this.margin.left - this.margin.right;
  @Input() svgHeight = 560 - this.margin.top - this.margin.bottom;

  // This is the better way, but is inconsistent with geomap
  // @Input() svgWidth = window.innerWidth - this.margin.left - this.margin.right - 300; // initializing width for map container
  // @Input() svgHeight: number = window.innerHeight - this.margin.top - this.margin.bottom - 200; // initializing height for map container
  private streamCache: StreamCache<any>;
  private streamSubscription: Subscription;
  private parentNativeElement: any; // a native Element to access this component's selector for drawing the map
  svgContainer: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  containerMain: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  mainG: d3Selection.Selection<SVGGElement, undefined, d3Selection.BaseType, any>;
  xAxisGroup: d3Selection.Selection<d3Selection.BaseType, any, d3Selection.BaseType, undefined>;
  yAxisGroup: d3Selection.Selection<d3Selection.BaseType, any, d3Selection.BaseType, undefined>;
  xScale: any; // d3Axis.AxisScale<any> couldn't figure out domain and range definition
  yScale: any; // d3Axis.AxisScale<any>
  xAxisLabel = 'x-axis'; // defaults
  yAxisLabel = 'y-axis'; // defaults
  xAxis: any; // d3Axis.Axis<any>;
  yAxis: any; // d3Axis.Axis<{}>;
  data: Point[] = [];

  constructor(element: ElementRef, public dataService: ScatterplotDataService) {
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() {
    this.setScales([]);
    this.initVisualization();
    this.updateAxisLabels();

    this.dataService.points.subscribe((data) => {
      this.data = this.data.filter((e: Point) => !data.remove
        .some((obj: Point) => obj.id === e.id)).concat(data.add);

      data.update.forEach((el) => {
        const index = this.data.findIndex((e) => e.id === el[1].id);
        this.data[index] = Object.assign(this.data[index] || {}, <Point>el[1]);
      });

      this.setScales(this.data);
      this.drawPlots(this.data);
      this.drawText(this.data);
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName.endsWith('Stream') && this[propName]) {
        this.data = [];
        this.streamCache = new StreamCache<any>(this.pointIDField, this.dataStream);
        this.updateStreamProcessor(false);
      } else if (propName.endsWith('Field') && this[propName]) {
        this.updateStreamProcessor();
      }
    }
  }

  updateStreamProcessor(update = true) {
    if (this.streamCache && this.xField && this.yField) {
      this.dataService.fetchData(
        this.streamCache.asObservable(), this.pointIDField,
         this.showPersonaField, this.xField, this.yField,
        this.colorField, this.shapeField, this.sizeField
      );
    }
    if (this.streamCache && update) {
      this.streamCache.sendUpdate();
    }
  }

  updateAxisLabels() {
    if (this.xField) {
      d3Selection.select('#xAxisLabel').text(this.xField.label); // text label for the x axis
    }
    if (this.yField) {
      d3Selection.select('#yAxisLabel').text(this.yField.label); // text label for the x axis
    }
  }

  /****** This function draws the svg container, axes and their labels ******/
  initVisualization() {
    // initializing svg container
    this.svgContainer = d3Selection.select(this.parentNativeElement)
      .select('#plotContainer')
      .append('svg')
      .attr('width', this.svgWidth + this.margin.right + this.margin.left)
      .attr('height', this.svgHeight + this.margin.top + this.margin.bottom)
      .attr('class', 'chart');

    this.containerMain = this.svgContainer.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .attr('class', 'main');

    // text label for the x axis
    this.containerMain.append('text')
      .attr('transform',
        'translate(' + (this.svgWidth / 2) + ' ,' +
        (this.svgHeight + this.margin.top + 20) + ')')
      .attr('id', 'xAxisLabel')
      .style('text-anchor', 'middle')
      .text(this.xAxisLabel);

    // text label for the y axis
    this.containerMain.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - (this.svgHeight / 2))
      .attr('dy', '1em')
      .attr('id', 'yAxisLabel')
      .style('text-anchor', 'middle')
      .text(this.yAxisLabel);

    // draw the x axis
    this.xAxis = d3Axis.axisBottom(this.xScale);
    this.xAxisGroup = this.containerMain.append('g')
      .attr('transform', 'translate(0,' + this.svgHeight + ')')
      .attr('class', 'xAxis')
      .call(this.xAxis);

    // draw the y axis
    this.yAxis = d3Axis.axisLeft(this.yScale);
    this.yAxisGroup = this.containerMain.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'yAxis')
      .call(this.yAxis);

    this.mainG = this.containerMain.append('g');
  }

  /********* This function draws points on the scatterplot ********/
  drawPlots(data: Point[]) {
    const xscale = this.xScale;
    const yscale = this.yScale;

    this.xAxisGroup.transition().call(this.xAxis);  // Update X-Axis
    this.yAxisGroup.transition().call(this.yAxis);  // Update Y-Axis

    const plots = this.mainG.selectAll('.plots')
      .data(data, (d: Point) => d.id);

    plots.transition().duration(500)
      .attr('d', d3Shape.symbol()
        .size((d) => <number>2 * d.size)
        .type((d) => this.selectShape(d)))
      .attr('stroke', (d) => {
          if (d.showPersona === true) {
            return 'green';
          } else {
            return 'black';
          }
         })
      .attr('stroke-width', '2px')
      .attr('transform', (d) => this.shapeTransform(d))
      .transition().duration(1000).attr('fill', (d) => d.color).attr('r', 8);

    plots.enter().append('path')
      .data(data)
      .attr('class', 'plots')
      .attr('d', d3Shape.symbol()
        .size((d) => <number>2 * d.size)
        .type((d) => this.selectShape(d)))
      .attr('transform', (d) => this.shapeTransform(d))
      .attr('fill', 'red')
      .attr('stroke', (d) => {
        if (d.showPersona === true) {
          return 'green';
        } else {
          return 'black';
        }
      })
      .attr('stroke-width', '2px')
      .transition().duration(1000).attr('fill', (d) => d.color).attr('r', 8);

    plots.exit().remove();
  }
  /**** This function draws text next to each plot with info about it ****/
  drawText(data: Point[], enabled = false) {
    if (enabled) {
      const labels = this.mainG.selectAll('.label')
        .data(data, (d: Point) => d.id);

      labels.transition().duration(500)
        .attr('x', (d) => this.xScale(d.x) + 12)
        .attr('y', (d) => this.yScale(d.y) + 14)
        .text((d) => '(' + d.showPersona + ')')
        .attr('font-size', '8px');

      labels.enter().append('text')
        .data(data)
        .attr('class', 'label')
        .attr('x', (d) => this.xScale(d.x) + 12)
        .attr('y', (d) => this.yScale(d.y) + 14)
        .text((d) => '(' + d.showPersona + ')')
        .attr('font-size', '8px');

      labels.exit().remove();
    }
  }

  /**** This function draws the shape encoded on the data ****/
  selectShape(d) {
    switch (d.shape) {
      case 'circle': return d3Shape.symbolCircle;
      case 'square': return d3Shape.symbolSquare;
      case 'cross': return d3Shape.symbolCross;
      case 'diamond': return d3Shape.symbolDiamond;
      case 'triangle-up': return d3Shape.symbolTriangle;
      case 'triangle-down': return d3Shape.symbolTriangle;
      case 'triangle-left': return d3Shape.symbolTriangle;
      case 'triangle-right': return d3Shape.symbolTriangle;
      case 'star': return d3Shape.symbolStar;
      case 'wye': return d3Shape.symbolWye;
      default: return d3Shape.symbolCircle;
    }
  }

  /**** This function applies a transform to the shape encoded on the data ****/
  shapeTransform(d) {
    let rotation = 0;

    switch (d.shape) {
      case 'triangle-down':
        rotation = 180;
        break;
      case 'triangle-left':
        rotation = -90;
        break;
      case 'triangle-right':
        rotation = 90;
        break;
    }

    return `translate(${this.xScale(d.x)},${this.yScale(d.y)})` +
      `rotate(${rotation})`;
  }

  /**** This function sets scales on x and y axes based on fields selected *****/
  setScales(data: Point[]) {
    switch (this.xField.datatype) {
      default:
      case 'number':
        this.xScale = scaleLinear();
        this.xAxis = d3Axis.axisBottom(this.xScale);
        this.xScale.domain([0, d3Array.max(data, (d) => Number(d.x))])
          .range([0, this.svgWidth]);
        break;

      case 'string':
        this.xScale = scalePoint();
        this.xAxis = d3Axis.axisBottom(this.xScale);
        this.xScale.domain(data.map(el => el.x))
          .range([0, this.svgWidth]);
        break;
    }

    switch (this.yField.datatype) {
      default:
      case 'number':
        this.yScale = scaleLinear();
        this.yAxis = d3Axis.axisLeft(this.yScale);
        this.yScale.domain([0, d3Array.max(data, (d) => Number(d.y))])
          .range([this.svgHeight, 0]);
        break;

      case 'string':
        this.yScale = scalePoint();
        this.yAxis = d3Axis.axisLeft(this.yScale);
        this.yScale.domain(data.map(el => el.y))
          .range([this.svgHeight, 0]);
        break;

    }
    this.updateAxisLabels();
  }
}
