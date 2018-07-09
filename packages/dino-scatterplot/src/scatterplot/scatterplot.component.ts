import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  Input,
  SimpleChanges,
  DoCheck,
  ViewChild, ViewEncapsulation
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

import {
  BoundField,
  RawChangeSet,
  Datum,
  idSymbol, rawDataSymbol
} from '@ngx-dino/core';
import { ScatterplotDataService } from '../shared/scatterplot-data.service';
import { Point } from '../shared/point';

@Component({
  selector: 'dino-scatterplot',
  templateUrl: './scatterplot.component.html',
  styleUrls: ['./scatterplot.component.sass'],
  providers: [ScatterplotDataService],
  encapsulation: ViewEncapsulation.None
})
export class ScatterplotComponent implements OnInit, OnChanges, DoCheck {
  @Input() pointIdField: BoundField<number | string>;
  @Input() strokeColorField: BoundField<number | string>;
  @Input() xField: BoundField<number | string>;
  @Input() yField: BoundField<number | string>;
  @Input() colorField: BoundField<number | string>;
  @Input() shapeField: BoundField<number | string>;
  @Input() sizeField: BoundField<number | string>;

  @Input() tooltipTextField: BoundField<number | string>;
  @Input() enableTooltip = false;

  @Input() dataStream: Observable<RawChangeSet<any>>;
  @Input() pulseItem: any;

  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };

  // Temporary change so that Geomap and Scatterplot are the same size.
  @Input() width = 955 - this.margin.left - this.margin.right;
  @Input() height = 560 - this.margin.top - this.margin.bottom;
  @Input() autoresize = false;

  @ViewChild('plotContainer') scatterplotElement: ElementRef;

  // This is the better way, but is inconsistent with geomap
  // @Input() width = window.innerWidth - this.margin.left - this.margin.right - 300; // initializing width for map container
  // @Input() height: number = window.innerHeight - this.margin.top - this.margin.bottom - 200; // initializing height for map container
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

  tooltipDiv: any;

  private elementWidth = 0;
  private elementHeight = 0;

  constructor(element: ElementRef, public dataService: ScatterplotDataService) {
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() {
    this.setScales([]);
    this.initVisualization();
    this.updateAxisLabels();

    this.dataService.points.subscribe((data) => {
      this.data = this.data.filter((e: Point) => !data.remove
        .some((obj: Datum<Point>) => obj[idSymbol] === e.id)).concat(data.insert.toArray() as any);

      data.update.forEach((el: any) => { // TODO typing for el
        const index = this.data.findIndex((e) => e.id === el.id); // TODO idsymbol
        if (index != -1) {
          this.data[index] = Object.assign(this.data[index] || {}, el as Point);
        }
      });
  
      data.replace.forEach((el: any) => { // TODO typing for el
        const index = this.data.findIndex((e) => e[idSymbol] === el[idSymbol]); // TODO id
        if (index != -1) {
          this.data[index] = el as Point;
        }
      });


      this.setScales(this.data);
      this.drawPlots(this.data);
      this.drawText(this.data);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataStream' in changes && this.dataStream) {
      this.data = [];
      this.updateStreamProcessor(false);
    } else if (Object.keys(changes).filter((k) => k.endsWith('Field'))) {
      this.updateStreamProcessor();
      this.updateAxisLabels();
      // updateField(....)
    }

    if ('pulseItem' in changes && this.mainG) {
      this.mainG.selectAll('.pulse-container').remove();

      const {currentValue} = changes['pulseItem'];
      if (currentValue) {
        const id = this.pointIdField.get(currentValue[rawDataSymbol]);
        const node = this.mainG.selectAll('.plots')
          .filter((d) => d[idSymbol] === id);
        const datum = node.datum();
        const path = node.attr('d');

        const pulseGroup = this.mainG.insert('g', ':first-child')
          .classed('pulse-container', true)
          .datum(datum)
          .attr('transform', this.shapeTransform(datum));
        const pulsePath = pulseGroup.append('path')
          .classed('pulse-path', true)
          .attr('d', path);
      }
    }

    if ((!this.autoresize) && (('width' in changes) && ('height' in changes))) {
      this.resize(this.width, this.height);
    }
  }

  ngDoCheck() {
    if (this.autoresize && this.scatterplotElement) {
      const width = this.scatterplotElement.nativeElement.clientWidth
        - 1 / 5 * this.scatterplotElement.nativeElement.clientWidth; // FIXME - hack
      const height = this.scatterplotElement.nativeElement.clientWidth
        - 1 / 2 * this.scatterplotElement.nativeElement.clientWidth; // FIXME - hack
      this.resize(width, height);
    }
  }

  private resize(width: number, height: number): void {
    if (width !== this.elementWidth || height !== this.elementHeight) {
      this.elementWidth = width;
      this.elementHeight = height;

      if (this.svgContainer) {
        this.svgContainer.remove();
      }

      this.setScales(this.data);
      this.initVisualization();
      this.updateAxisLabels();
      this.drawPlots(this.data);
      this.drawText(this.data);
    }
  }

  updateStreamProcessor(update = true) {
    if (this.xField && this.yField && this.dataService.pointProcessor) {
      this.dataService.updateData();
    }
    if (!update) {
      this.dataService.fetchData(
        this.dataStream,

        this.pointIdField,

        this.xField, this.yField,

        this.colorField, this.shapeField,
        this.sizeField, this.strokeColorField
      );
    }
  }

  updateAxisLabels() {
    if (this.xField) {
      this.containerMain.select('.xAxisLabel').text(this.xField.label); // text label for the x axis
    }
    if (this.yField) {
      this.containerMain.select('.yAxisLabel').text(this.yField.label); // text label for the x axis
    }
  }

  /****** This function draws the svg container, axes and their labels ******/
  initVisualization() {
    // initializing svg container
    this.svgContainer = d3Selection.select(this.parentNativeElement)
      .select('.plotContainer')
      .append('svg')
      .attr('width', this.elementWidth + this.margin.right + this.margin.left)
      .attr('height', this.elementHeight + this.margin.top + this.margin.bottom)
      .attr('class', 'chart');

    this.containerMain = this.svgContainer.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr('width', this.elementWidth)
      .attr('height', this.elementHeight)
      .classed('svg-content-responsive', true)
      .attr('class', 'main');

    // Add arrow marker for axes
    this.svgContainer.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 5 10 L 10 0 z');

    // text label for the x-axis
    this.containerMain.append('text')
      .attr('transform',
        'translate(' + (this.elementWidth / 2) + ' ,' +
        (this.elementHeight + this.margin.top + 20) + ')')
      .attr('class', 'xAxisLabel')
      .style('text-anchor', 'middle')
      .text(this.xAxisLabel);

    // text label for the y-axis
    this.containerMain.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - (this.elementHeight / 2))
      .attr('dy', '1em')
      .attr('class', 'yAxisLabel')
      .style('text-anchor', 'middle')
      .text(this.yAxisLabel);

    // draw the x axis
    this.xAxis = d3Axis.axisBottom(this.xScale).tickSizeOuter(0);
    this.xAxisGroup = this.containerMain.append('g')
      .attr('transform', 'translate(0,' + this.elementHeight + ')')
      .attr('class', 'xAxis')
      .call(this.xAxis);
    this.xAxisGroup.select('path').attr('marker-end', 'url(#arrowhead)');

    // draw the y axis
    this.yAxis = d3Axis.axisLeft(this.yScale).tickSizeOuter(0);
    this.yAxisGroup = this.containerMain.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'yAxis')
      .call(this.yAxis);
    this.yAxisGroup.select('path').attr('marker-end', 'url(#arrowhead)');

    this.mainG = this.containerMain.append('g');

    if (this.enableTooltip) {
      this.tooltipDiv = d3Selection.select(this.parentNativeElement)
        .select('.plotContainer').select('.tooltip');
    }
  }

  /********* This function draws points on the scatterplot ********/
  drawPlots(data: Point[]) {
    const xscale = this.xScale;
    const yscale = this.yScale;

    this.xAxisGroup.transition().call(this.xAxis);  // Update X-Axis
    this.yAxisGroup.transition().call(this.yAxis);  // Update Y-Axis

    const plots = this.mainG.selectAll('.plots')
      .data(data, (d: Point) => d[idSymbol]);

    plots
      .attr('d', d3Shape.symbol()
        .size((d) => <number>2 * d.size)
        .type((d) => this.selectShape(d)))
      .attr('stroke', (d) => d.stroke)
      .attr('stroke-width', '2px')
      .attr('transform', (d) => this.shapeTransform(d))
      .attr('fill', (d) => d.color).attr('r', 8);

    this.mainG.selectAll('.pulse-container').transition().duration(500)
      .attr('transform', (d) => this.shapeTransform(d));

    plots.enter().append('path')
      .data(data)
      .attr('class', 'plots')
      .attr('id', (d) => d[idSymbol])
      .attr('d', d3Shape.symbol()
        .size((d) => <number>2 * d.size)
        .type((d) => this.selectShape(d)))
      .attr('transform', (d) => this.shapeTransform(d))
      .attr('fill', 'red')
      .attr('stroke', (d) => d.stroke)
      .attr('stroke-width', '2px')
      .transition().duration(1000).attr('fill', (d) => d.color);

    this.svgContainer.selectAll('.plots')
      .on('mouseover', (d) => this.onMouseOver(d[idSymbol]));

    this.svgContainer.selectAll('.plots')
      .on('mouseout', (d) => this.onMouseOut(d[idSymbol]));

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
        .text((d) => '(' + d.shape + ')')
        .attr('font-size', '8px');

      labels.enter().append('text')
        .data(data)
        .attr('class', 'label')
        .attr('x', (d) => this.xScale(d.x) + 12)
        .attr('y', (d) => this.yScale(d.y) + 14)
        .text((d) => '(' + d.shape + ')')
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
    switch (this.xField.dataType) {
      default:
      case 'number':
        this.xScale = scaleLinear();
        this.xAxis = d3Axis.axisBottom(this.xScale).tickSizeOuter(0);
        this.xScale.domain([0, d3Array.max(data, (d) => Number(d.x))])
          .range([0, this.elementWidth]);
        break;

      case 'string':
        this.xScale = scalePoint();
        this.xAxis = d3Axis.axisBottom(this.xScale).tickSizeOuter(0);
        this.xScale.domain(data.map(el => el.x))
          .range([0, this.elementWidth]);
        break;
    }

    switch (this.yField.dataType) {
      default:
      case 'number':
        this.yScale = scaleLinear();
        this.yAxis = d3Axis.axisLeft(this.yScale).tickSizeOuter(0);
        this.yScale.domain([0, d3Array.max(data, (d) => Number(d.y))])
          .range([this.elementHeight, 0]);
        break;

      case 'string':
        this.yScale = scalePoint();
        this.yAxis = d3Axis.axisLeft(this.yScale).tickSizeOuter(0);
        this.yScale.domain(data.map(el => el.y))
          .range([this.elementHeight, 0]);
        break;
    }
  }

  onMouseOver(targetId: any) {
    let tooltipText = '';
    const selection = this.svgContainer.selectAll('.plots')
      .filter((d: any) => {
        if (d[idSymbol] === targetId) {
          if (this.enableTooltip) {
            tooltipText = d.tooltip.toString();
          }
          return true;
        }
      });

    selection.transition().attr('d', d3Shape.symbol()
    .size((d) => <number>4 * <number>d.size)
    .type((d) => this.selectShape(d)))

    if(this.enableTooltip) {
      this.tooltipDiv.transition().style('opacity', .7)
      .style('visibility', 'visible');

      this.tooltipDiv.html(tooltipText)
      .style('left', d3Selection.event.x - 50 + 'px')
      .style('top',  d3Selection.event.y - 40+ 'px');
    }
  }

  onMouseOut(targetId: any) {
    const selection = this.svgContainer.selectAll('.plots')
    .filter((d: any) => d[idSymbol] === targetId);

    selection.transition().attr('d', d3Shape.symbol()
    .size((d) => <number>2 * <number>d.size)
    .type((d) => this.selectShape(d)))

    if(this.enableTooltip) {
      this.tooltipDiv.style('opacity', 0)
      .style('visibility', 'hidden');
    }
  }
}
