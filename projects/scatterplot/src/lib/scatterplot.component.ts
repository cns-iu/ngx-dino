import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  Input,
  SimpleChanges, SimpleChange,
  DoCheck,
  ViewChild, ViewEncapsulation
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import * as d3Axis from 'd3-axis';
import * as d3Selection from 'd3-selection';
import 'd3-transition'; // This adds transition support to d3-selection
import * as d3Array from 'd3-array';
import {
  scaleLinear, scalePoint
} from 'd3-scale';
import * as d3Shape from 'd3-shape';

import {
  BoundField,
  RawChangeSet,
  Datum,
  idSymbol
} from '@ngx-dino/core';

import { ScatterplotDataService } from './shared/scatterplot-data.service';
import { Point } from './shared/point';

@Component({
  selector: 'dino-scatterplot',
  templateUrl: './scatterplot.component.html',
  styleUrls: ['./scatterplot.component.css'],
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
  @Input() pulseField: BoundField<boolean>;

  @Input() tooltipTextField: BoundField<number | string>;
  @Input() enableTooltip = false;

  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };

  // Temporary change so that Geomap and Scatterplot are the same size.
  @Input() width = 955 - this.margin.left - this.margin.right;
  @Input() height = 560 - this.margin.top - this.margin.bottom;
  @Input() autoresize = false;

  @Input() xAxisArrow = true;
  @Input() yAxisArrow = true;

  @Input() gridlines = false;
  @Input() gridlinesColor = 'lightgrey';
  @Input() gridlinesOpacity = 0.7;

  @Input() tickLabelColor = 'lightblack';

  @Input() showAxisIndicators = false; // Toggle texts over axes indicating the type of axis
  @Input() showAxisLabels = false;

  @ViewChild('plotContainer') scatterplotElement: ElementRef;

  // This is the better way, but is inconsistent with geomap
  // @Input() width = window.innerWidth - this.margin.left - this.margin.right - 300; // initializing width for map container
  // @Input() height: number = window.innerHeight - this.margin.top - this.margin.bottom - 200; // initializing height for map container
  private streamSubscription: Subscription;

  private parentNativeElement: any; // a native Element to access this component's selector for drawing the map
  svgContainer: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  containerMain: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  pulseG: d3Selection.Selection<SVGGElement, undefined, d3Selection.BaseType, any>;
  mainG: d3Selection.Selection<SVGGElement, undefined, d3Selection.BaseType, any>;
  xAxisGroup: d3Selection.Selection<d3Selection.BaseType, any, d3Selection.BaseType, undefined>;
  yAxisGroup: d3Selection.Selection<d3Selection.BaseType, any, d3Selection.BaseType, undefined>;

  xScale: any; // d3Axis.AxisScale<any> couldn't figure out domain and range definition
  yScale: any; // d3Axis.AxisScale<any>

  // x & y labels are field labels  - not drawnq over the axes
  xAxisLabel = ''; // defaults
  yAxisLabel = ''; // defaults

  // x & y text are svg elements with text drawn over the axes denoting the type of axis.
  xAxisText: any;
  yAxisText: any;

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
    if (this.xField && this.yField) {
      this.setScales([]);
      this.initVisualization();
    }
    this.dataService.points.subscribe((data) => {
      this.data = this.data.filter((e: Point) => !data.remove
        .some((obj: Datum<Point>) => obj[idSymbol] === e.id)).concat(data.insert.toArray() as any);

      data.update.forEach((el: any) => { // TODO typing for el
        const index = this.data.findIndex((e) => e.id === el[idSymbol]);
        if (index !== -1) {
          this.data[index] = Object.assign(this.data[index] || {}, el as Point);
        }
      });

      data.replace.forEach((el: any) => { // TODO typing for el
        const index = this.data.findIndex((e) => e.id === el[idSymbol]);
        if (index !== -1) {
          this.data[index] = el as Point;
        }
      });

      if (this.data.length > 0) {
        this.setScales(this.data);
        this.drawPlots(this.data);
        this.drawText(this.data);

        if (this.showAxisIndicators) {
          this.updateAxisTexts();
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataStream' in changes && this.dataStream) {
      this.data = [];
      this.updateStreamProcessor(false);
    } else {
        if (Object.keys(changes).find((k) => k.endsWith('Field')) !== undefined
          && (!('xField' in changes) && !('yField' in changes))
        ) {
            const changedField =  changes[Object.keys(changes).find((k) => k.endsWith('Field'))].currentValue;
            this.updateStreamProcessor(true, changedField);
        }

        if (('xField' in changes) || ('yField' in changes)) {
          if (this.showAxisLabels) {
            this.updateAxisLabels();
          }

          const axis = Object.keys(changes)[0][0];
          if (axis === 'x') {
            this.updateStreamProcessor(true, changes.xField.currentValue, axis);
          } else if (axis === 'y') {
            this.updateStreamProcessor(true, changes.yField.currentValue, axis);
          }

          this.setScales(this.data);
          this.drawPlots(this.data);
        }

        if ('showAxisLabels' in changes) {
          this.updateAxisLabels();
        }
      }

    if ('xAxisArrow' in changes && this.xAxis) {
      this.xAxisGroup.select('path')
        .attr('marker-end', this.xAxisArrow ? 'url(#arrowhead)' : null);
    }

    if ('yAxisArrow' in changes && this.yAxis) {
      this.yAxisGroup.select('path')
        .attr('marker-end', this.yAxisArrow ? 'url(#arrowhead)' : null);
    }

    if ((!this.autoresize) && (('width' in changes) && ('height' in changes))) {
      this.resize(this.width, this.height);
    }
  }

  ngDoCheck() {
  }

  private resize(width: number, height: number): void {
    width -= this.margin.left + this.margin.right;
    height -= this.margin.top + this.margin.bottom;
    if (width !== this.elementWidth || height !== this.elementHeight) {
      this.elementWidth = width;
      this.elementHeight = height;

      if (this.svgContainer) {
        this.svgContainer.remove();
      }

      this.setScales(this.data);
      this.initVisualization();
      if (this.showAxisLabels) {
        this.updateAxisLabels();
      }
      this.drawPlots(this.data);
      this.drawText(this.data);
      if (this.data.length > 0 && this.showAxisIndicators) {
        this.updateAxisTexts();
      }
    }
  }

  doResize({width, height}: {width: number, height: number}): void {
    if (this.autoresize) {
      this.resize(width, height);
    }
  }

  updateStreamProcessor(
    update = true,
    changedField?: BoundField<number | string>,
    label?: string
    ) {
    if (this.xField && this.yField && this.dataService.pointProcessor && changedField) {
      if (label) {
        this.dataService.updateData(changedField, label);
      } else {
        this.dataService.updateData(changedField);
      }
    }
    if (!update) {
      this.dataService.fetchData(
        this.dataStream,

        this.pointIdField,

        this.xField, this.yField,

        this.colorField, this.shapeField,
        this.sizeField, this.strokeColorField,

        this.pulseField,

        (this.enableTooltip) ? this.tooltipTextField : undefined
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

  updateAxisTexts() {
    this.xAxisText.attr('transform', 'translate(' + (this.xScale(this.xScale.domain()[0]) + 10) + ' ,' +
      (this.yScale(this.yScale.domain()[0]) - 15) + ')');
    this.xAxisText.attr('visibility', 'visible');

    this.yAxisText.attr('transform', 'translate(' + (this.xScale(this.xScale.domain()[0]) - 15) + ' ,' +
      (this.yScale(this.yScale.domain()[0]) - 10) + ') rotate(-90)');
    this.yAxisText.attr('visibility', 'visible');
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
      .attr('transform', 'rotate(-90, 5, 5)')
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
    this.xAxis = d3Axis.axisBottom(this.xScale)
      .tickSizeOuter(0)
      .tickPadding(10);
    if (this.gridlines) {
      this.xAxis.tickSizeInner(-this.elementHeight); // for x-gridlines
    }
    this.xAxisGroup = this.containerMain.append('g')
      .attr('transform', 'translate(0,' + this.elementHeight + ')')
      .attr('class', 'xAxis')
      .call(this.xAxis);
    this.xAxisGroup.select('path')
      .attr('marker-end', this.xAxisArrow ? 'url(#arrowhead)' : null);

    // draw the y axis
    this.yAxis = d3Axis.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickPadding(10);
    if (this.gridlines) {
      this.yAxis.tickSizeInner(-this.elementWidth); // for y-gridlines
    }
    this.yAxisGroup = this.containerMain.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'yAxis')
      .call(this.yAxis);
    this.yAxisGroup.select('path')
      .attr('marker-end', this.yAxisArrow ? 'url(#arrowhead)' : null);

    if (this.gridlines) { // set color and opacity of gridlines
      this.setGridlineProperties();
    }

    if (this.showAxisIndicators) {
      // draw the text over axes
      this.xAxisText = this.containerMain.append('g');
      this.xAxisText.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', 50). attr('height', 20).attr('fill', 'white');
      this.xAxisText.append('text').text('X axis')
        .attr('x', 5).attr('y', 20)
        .attr('dy', '0.1em').attr('fill', 'black');
      this.xAxisText.attr('visibility', 'hidden');

      this.yAxisText = this.containerMain.append('g');
      this.yAxisText.append('rect')
        .attr('x', 0).attr('y', 10)
        .attr('width', 50). attr('height', 20).attr('fill', 'white');
      this.yAxisText.append('text').text('Y axis')
        .attr('x', 5).attr('y', 20)
        .attr('dy', '0.1em').attr('fill', 'black');
      this.yAxisText.attr('visibility', 'hidden');
    }

    this.pulseG = this.containerMain.append('g');
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

    if (this.gridlines) {  // update axis and gridlines according to new scale
      this.xAxis = d3Axis.axisBottom(this.xScale)
        .tickSizeInner(-this.elementHeight)
        .tickSizeOuter(0)
        .tickPadding(10);

      this.yAxis = d3Axis.axisLeft(this.yScale)
        .tickSizeInner(-this.elementWidth)
        .tickSizeOuter(0)
        .tickPadding(10);
    }

    this.xAxisGroup.transition().call(this.xAxis);  // Update X-Axis
    this.yAxisGroup.transition().call(this.yAxis);  // Update Y-Axis

    if (this.gridlines) { // set color and opacity of updated gridlines
      this.setGridlineProperties();
    }

    if (this.tickLabelColor) {
      this.svgContainer.selectAll('.tick text').attr('stroke', this.tickLabelColor);
    }

    // Insert pulses

    const pulse = this.pulseG.selectAll('g')
      .data(data.filter((p) => p.pulse), (p) => p[idSymbol]);

    pulse.attr('transform', (d) => this.shapeTransform(d))
      .selectAll('.pulsing')
      .attr('d', d3Shape.symbol()
        .size((d) => <number>2 * d.size)
        .type((d) => this.selectShape(d)))
      .attr('stroke', (d: any) => d.color === '#ffffff' ? '#000000' : d.stroke);

    pulse.enter().append('g')
      .attr('transform', (d) => this.shapeTransform(d))
      .append('path')
      .classed('pulsing', true)
      .attr('d', d3Shape.symbol()
        .size((d) => <number>2 * d.size)
        .type((d) => this.selectShape(d)))
      .attr('stroke', (d) => d.color === '#ffffff' ? '#000000' : d.stroke);

    pulse.exit().remove();

    // Insert items
    const plots = this.mainG.selectAll('.plots')
      .data(data, (d: Point) => d[idSymbol]);

    plots
      .attr('d', d3Shape.symbol()
        .size((d) => d.size as number)
        .type((d) => this.selectShape(d)))
      .attr('stroke', (d) => d.color === '#ffffff' ? '#000000' : d.stroke)
      .attr('stroke-width', 1)
      .attr('transform', (d) => this.shapeTransform(d))
      .attr('fill', (d) => d.color);

    plots.enter().append('path')
      .data(data)
      .attr('class', 'plots')
      .attr('id', (d) => d[idSymbol])
      .attr('d', d3Shape.symbol()
        .size((d) => d.size as number)
        .type((d) => this.selectShape(d)))
      .attr('transform', (d) => this.shapeTransform(d))
      .attr('fill', 'red')
      .attr('stroke', (d) => d.color === '#ffffff' ? '#000000' : d.stroke)
      .attr('stroke-width', 1)
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

  setGridlineProperties() {
    this.svgContainer.selectAll('.tick line')
    .attr('stroke', this.gridlinesColor)
    .attr('stroke-opacity', this.gridlinesOpacity);

    this.svgContainer.select('.xAxis > g:first-of-type').select('line')
    .attr('stroke', 'black')
    .attr('stroke-opacity', 1);

    this.svgContainer.select('.yAxis > g:first-of-type').select('line')
    .attr('stroke', 'black')
    .attr('stroke-opacity', 1);
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
        this.xScale.domain([d3Array.min(data, (d) => Number(d.x)), d3Array.max(data, (d) => Number(d.x))])
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
        this.yScale.domain([d3Array.min(data, (d) => Number(d.y)), d3Array.max(data, (d) => Number(d.y))])
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
    .size((d) => 2 * d.size as number)
    .type((d) => this.selectShape(d)));

    if (this.enableTooltip) {
      this.tooltipDiv.transition().style('opacity', .7)
      .style('visibility', 'visible');

      this.tooltipDiv.html(tooltipText)
      .style('left', d3Selection.event.x - 50 + 'px')
      .style('top',  d3Selection.event.y - 40 + 'px');
    }
  }

  onMouseOut(targetId: any) {
    const selection = this.svgContainer.selectAll('.plots')
    .filter((d: any) => d[idSymbol] === targetId);

    selection.transition().attr('d', d3Shape.symbol()
    .size((d) => d.size as number)
    .type((d) => this.selectShape(d)));

    if (this.enableTooltip) {
      this.tooltipDiv.style('opacity', 0)
      .style('visibility', 'hidden');
    }
  }
}
