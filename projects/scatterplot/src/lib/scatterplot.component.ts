import 'd3-transition';

import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { BoundField, ChangeSet, Datum, DatumId, idSymbol, RawChangeSet } from '@ngx-dino/core';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Format from 'd3-format';
import { ScaleLinear, scaleLinear, ScalePoint, scalePoint } from 'd3-scale';
import * as d3Selection from 'd3-selection';
import * as d3Shape from 'd3-shape';
import { Set } from 'immutable';
import { isNil, uniqBy } from 'lodash';
import { Observable, Subscription } from 'rxjs';

import { Point } from './shared/point';
import { ScatterplotDataService } from './shared/scatterplot-data.service';

@Component({
  selector: 'dino-scatterplot',
  templateUrl: './scatterplot.component.html',
  styleUrls: ['./scatterplot.component.css'],
  providers: [ScatterplotDataService],
  encapsulation: ViewEncapsulation.None
})
export class ScatterplotComponent implements OnInit, OnChanges {
  @Input() pointIdField: BoundField<number | string>;
  @Input() strokeColorField: BoundField<number | string>;
  @Input() xField: BoundField<number | string>;
  @Input() yField: BoundField<number | string>;
  @Input() colorField: BoundField<number | string>;
  @Input() shapeField: BoundField<number | string>;
  @Input() sizeField: BoundField<number | string>;
  @Input() pulseField: BoundField<boolean>;

  @Input() transparencyField: BoundField<number>;
  @Input() strokeTransparencyField: BoundField<number>;


  @Input() tooltipTextField: BoundField<number | string>;
  @Input() enableTooltip = false;

  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };
  @Input() maxYAxisLabelWidth = 160;

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

  @ViewChild('plotContainer', { static: true }) scatterplotElement: ElementRef;

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

  xScale: unknown;
  yScale: unknown;

  transparencyScale: ScaleLinear<number, number>;
  // x & y labels are field labels  - not drawnq over the axes
  xAxisLabel = ''; // defaults
  yAxisLabel = ''; // defaults

  // x & y text are svg elements with text drawn over the axes denoting the type of axis.
  xAxisText: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  yAxisText: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;

  xAxis: d3Axis.Axis<d3Axis.AxisDomain>;
  yAxis: d3Axis.Axis<d3Axis.AxisDomain>;

  maxYAxisTickWidth = 0;

  data: Point[] = [];

  tooltipDiv: d3Selection.Selection<HTMLDivElement, {}, HTMLDivElement, any>;

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
    this.dataService.points.subscribe((changes) => {
      this.data = this.applyChangeSet(changes, this.data);

      if (this.data.length > 0) {
        this.updateMaxYAxisTickWidth();
        this.setScales(this.data);
        this.drawPlots(this.data);
        this.drawText(this.data);

        if (this.showAxisIndicators) {
          this.updateAxisTexts();
        }
      } else {
        this.svgContainer.remove();
        this.setScales([]);
        this.initVisualization();
      }
    });
  }

  private applyChangeSet<T extends Datum>(set: ChangeSet<any>, data: T[]): T[] {
    const removeIds = set.remove.map(rem => rem[idSymbol]);
    const replaceIds = set.replace.map(rep => rep[idSymbol]);
    const filteredIds = Set<DatumId>().merge(removeIds, replaceIds);
    const filtered = data.filter(item => !filteredIds.has(item[idSymbol]));
    const appliedData = filtered.concat(set.insert.toArray() as T[], set.replace.toArray() as T[]);
    const uniqueData = uniqBy(appliedData.reverse(), idSymbol).reverse();

    // Filter out bad/incomplete data (usually when not all fields are set yet)
    const goodData = uniqueData.filter(item => !isNil(item[idSymbol]) && !isNil(item['x']) && !isNil(item['y']));
    goodData.forEach(item => item['size'] = !isNil(item['size']) ? item['size'] : 28);
    return goodData;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataStream' in changes && this.dataStream) {
      this.data = [];
      this.updateStreamProcessor(false);
    } else {
      if ('maxYAxisLabelWidth' in changes) {
        this.updateMaxYAxisTickWidth();
      }

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
      this.xAxisGroup.select('path').attr('marker-end', this.xAxisArrow ? 'url(#arrowhead)' : null);
    }

    if ('yAxisArrow' in changes && this.yAxis) {
      this.yAxisGroup.select('path').attr('marker-end', this.yAxisArrow ? 'url(#arrowhead)' : null);
    }

    if ((!this.autoresize) && (('width' in changes) && ('height' in changes))) {
      this.resize(this.width, this.height);
    }
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

        this.transparencyField,
        this.strokeTransparencyField,
        this.pulseField,

        (this.enableTooltip) ? this.tooltipTextField : undefined
      );
    }
  }

  updateMaxYAxisTickWidth() {
    // Estimate how much extra padding to use for Y-Axis text.
    // TODO: Use font-metrics to compute the width more accurately
    const oldMax = this.maxYAxisTickWidth;
    this.maxYAxisTickWidth = Math.min(this.maxYAxisLabelWidth, d3Array.max(this.data, (d: Point) => String(d.y).length * 4));
    if (oldMax !== this.maxYAxisTickWidth) {
      this.svgContainer.remove();
      this.initVisualization();
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
    this.xAxisText.attr('transform', 'translate(' +
    ((<d3Axis.AxisScale<d3Axis.AxisDomain>>this.xScale)((<d3Axis.AxisScale<d3Axis.AxisDomain>>this.xScale).domain()[0]) + 10) + ' ,' +
      ((<d3Axis.AxisScale<d3Axis.AxisDomain>>this.yScale)((<d3Axis.AxisScale<d3Axis.AxisDomain>>this.yScale).domain()[0]) - 15) + ')');
    this.xAxisText.attr('visibility', 'visible');

    this.yAxisText.attr('transform', 'translate(' +
    ((<d3Axis.AxisScale<d3Axis.AxisDomain>>this.xScale)((<d3Axis.AxisScale<d3Axis.AxisDomain>>this.xScale).domain()[0]) - 15) + ' ,' +
      ((<d3Axis.AxisScale<d3Axis.AxisDomain>>this.yScale)((<d3Axis.AxisScale<d3Axis.AxisDomain>>this.yScale).domain()[0]) - 10)
      + ') rotate(-90)');
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
      .attr('transform', 'translate(' + (this.margin.left + this.maxYAxisTickWidth) + ',' + this.margin.top + ')')
      .attr('width', this.elementWidth - this.maxYAxisTickWidth).attr('height', this.elementHeight)
      .classed('svg-content-responsive', true).attr('class', 'main');

    // Add arrow marker for axes
    this.svgContainer.append('defs').append('marker')
      .attr('id', 'arrowhead').attr('viewBox', '0 0 10 10').attr('refX', 5).attr('refY', 5).attr('markerWidth', 10)
      .attr('markerHeight', 10).attr('orient', 'auto').append('path').attr('transform', 'rotate(-90, 5, 5)')
      .attr('d', 'M 0 0 L 5 10 L 10 0 z');

    // text label for the x-axis
    this.containerMain.append('text').attr('transform', 'translate(' + (this.elementWidth / 2) + ' ,' +
    (this.elementHeight + this.margin.top + 20) + ')').attr('class', 'xAxisLabel').style('text-anchor', 'middle').text(this.xAxisLabel);

    // text label for the y-axis
    this.containerMain.append('text').attr('transform', 'rotate(-90)').attr('y', 0 - this.margin.left)
      .attr('x', 0 - (this.elementHeight / 2)).attr('dy', '1em').attr('class', 'yAxisLabel')
      .style('text-anchor', 'middle').text(this.yAxisLabel);

    // draw the x axis
    this.xAxis = d3Axis.axisBottom(this.xScale as d3Axis.AxisScale<d3Axis.AxisDomain>).tickSizeOuter(0).tickPadding(10);
    if (this.gridlines) {
      this.xAxis.tickSizeInner(-this.elementHeight); // for x-gridlines
    }
    this.xAxisGroup = this.containerMain.append('g').attr('transform', 'translate(0,' + this.elementHeight + ')')
    .attr('class', 'xAxis').call(this.xAxis);
    this.xAxisGroup.select('path').attr('marker-end', this.xAxisArrow ? 'url(#arrowhead)' : null);

    // draw the y axis
    this.yAxis = d3Axis.axisLeft(this.yScale as d3Axis.AxisScale<d3Axis.AxisDomain>).tickSizeOuter(0).tickPadding(10);
    if (this.gridlines) {
      this.yAxis.tickSizeInner(-(this.elementWidth + this.maxYAxisTickWidth)); // for y-gridlines
    }
    this.yAxisGroup = this.containerMain.append('g').attr('transform', 'translate(0,0)').attr('class', 'yAxis').call(this.yAxis);
    this.yAxisGroup.select('path')
      .attr('marker-end', this.yAxisArrow ? 'url(#arrowhead)' : null);

    if (this.gridlines) { // set color and opacity of gridlines
      this.setGridlineProperties();
    }

    if (this.showAxisIndicators) {
      // draw the text over axes
      this.xAxisText = this.containerMain.append('g');
      this.xAxisText.append('rect').attr('x', 0).attr('y', 0).attr('width', 50). attr('height', 20).attr('fill', 'white');
      this.xAxisText.append('text').text('X axis').attr('x', 5).attr('y', 20).attr('dy', '0.1em').attr('fill', 'black');
      this.xAxisText.attr('visibility', 'hidden');

      this.yAxisText = this.containerMain.append('g');
      this.yAxisText.append('rect').attr('x', 0).attr('y', 10).attr('width', 50). attr('height', 20).attr('fill', 'white');
      this.yAxisText.append('text').text('Y axis').attr('x', 5).attr('y', 20).attr('dy', '0.1em').attr('fill', 'black');
      this.yAxisText.attr('visibility', 'hidden');
    }

    this.pulseG = this.containerMain.append('g');
    this.mainG = this.containerMain.append('g');

    if (this.enableTooltip) {
      this.tooltipDiv = d3Selection.select(this.parentNativeElement).select('.plotContainer').select('.tooltip');
    }
  }

  /********* This function draws points on the scatterplot ********/
  drawPlots(data: Point[]) {
    if (this.gridlines) {  // update axis and gridlines according to new scale
      /* don't format if range of numbers in data points falls within 'year' 1000 to 3000 */
      const formatXaxis = d3Array.min(data, (d) => Number(d.x)) >= 1000 && d3Array.max(data, (d) => Number(d.x)) <= 3000 ?
       d3Format.format('04d') : null;
      const formatYaxis = d3Array.min(data, (d) => Number(d.y)) >= 1000 && d3Array.max(data, (d) => Number(d.y)) <= 3000 ?
      d3Format.format('04d') : null;

      this.xAxis = d3Axis.axisBottom(this.xScale as d3Axis.AxisScale<d3Axis.AxisDomain>)
        .tickFormat(formatXaxis).tickSizeInner(-this.elementHeight).tickSizeOuter(0).tickPadding(10);

      this.yAxis = d3Axis.axisLeft(this.yScale as d3Axis.AxisScale<d3Axis.AxisDomain>)
        .tickFormat(formatYaxis).tickSizeInner(-(this.elementWidth + this.maxYAxisTickWidth)).tickSizeOuter(0).tickPadding(10);
    }

    /* for usage of call () , please refer - https://github.com/d3/d3-transition#transition_call */
    this.xAxisGroup.transition().call(() => this.xAxis);  // Update X-Axis
    this.yAxisGroup.transition().call(() => this.yAxis);  // Update Y-Axis

    if (this.gridlines) { // set color and opacity of updated gridlines
      this.setGridlineProperties();
    }

    if (this.tickLabelColor) {
      this.svgContainer.selectAll('.tick text').attr('stroke', this.tickLabelColor);
    }

    // Insert pulses
    const pulse = this.pulseG.selectAll('g').data(data.filter((p: Point) => p.pulse), (p) => p[idSymbol]);

    pulse.attr('transform', (d) => this.shapeTransform(d)).selectAll('.pulsing').attr('d', d3Shape.symbol().size((d) => <number>2 * d.size)
        .type((d: Point) => this.selectShape(d))).attr('stroke', (d: Point) => d.color === '#ffffff' ? '#000000' : d.stroke);

    pulse.enter().append('g').attr('transform', (d: Point) => this.shapeTransform(d)).append('path').classed('pulsing', true)
    .attr('d', d3Shape.symbol().size((d: Point) => 2 * (<number>d.size)).type((d: Point) => this.selectShape(d)))
      .attr('stroke', (d: Point) => d.color === '#ffffff' ? '#000000' : d.stroke);

    pulse.exit().remove();

    // Insert items
    const plots = this.mainG.selectAll<SVGElement, Point[]>('.plots').data(data, (d) => d[idSymbol]);

    plots
      .attr('d', d3Shape.symbol().size((d: Point) => d.size as number).type((d: Point) => this.selectShape(d)))
      .attr('stroke', (d: Point) => d.color === '#ffffff' ? '#000000' : d.stroke).attr('stroke-width', 1)
      .attr('transform', (d: Point) => this.shapeTransform(d)).attr('fill', (d: Point) => d.color)
      .attr('fill-opacity', (d: Point) => this.transparencyScale(d.transparency))
      .attr('stroke-opacity', (d: Point) => this.transparencyScale(d.strokeTransparency));

    plots.enter().append('path')
      .data(data).attr('class', 'plots').attr('fill-opacity', (d: Point) => this.transparencyScale(d.transparency))
      .attr('stroke-opacity', (d: Point) => this.transparencyScale(d.strokeTransparency)).attr('id', (d) => d[idSymbol])
      .attr('d', d3Shape.symbol().size((d: Point) => d.size as number).type((d: Point) => this.selectShape(d)))
      .attr('transform', (d: Point) => this.shapeTransform(d)).attr('fill', (d: Point) => d.color)
      .attr('stroke', (d: Point) => d.color === '#ffffff' ? '#000000' : d.stroke).attr('stroke-width', 1);

    this.svgContainer.selectAll('.plots')
      .on('mouseover', (d: Point) => this.onMouseOver(d[idSymbol]));

    this.svgContainer.selectAll('.plots')
      .on('mouseout', (d: Point) => this.onMouseOut(d[idSymbol]));

    plots.exit().remove();
  }

  /**** This function draws text next to each plot with info about it ****/
  drawText(data: Point[], enabled = false) {
    if (enabled) {
      const labels = this.mainG.selectAll('.label').data(data, (d: Point) => d.id);

      labels.transition().duration(500)
        .attr('x', (d: Point) => (<d3Axis.AxisScale<d3Axis.AxisDomain>>this.xScale)(d.x) + 12)
        .attr('y', (d: Point) => (<d3Axis.AxisScale<d3Axis.AxisDomain>>this.yScale)(d.y) + 14).text((d: Point) => '(' + d.shape + ')')
        .attr('font-size', '8px');

      labels.enter().append('text')
        .data(data)
        .attr('class', 'label')
        .attr('x', (d: Point) => (<d3Axis.AxisScale<d3Axis.AxisDomain>>this.xScale)(d.x) + 12)
        .attr('y', (d: Point) => (<d3Axis.AxisScale<d3Axis.AxisDomain>>this.yScale)(d.y) + 14).text((d: Point) => '(' + d.shape + ')')
        .attr('font-size', '8px');

      labels.exit().remove();
    }
  }

  setGridlineProperties() {
     // color axes first
    this.svgContainer.select('.xAxis > g:first-of-type').select('line').attr('stroke', 'black').attr('stroke-opacity', 1);

    this.svgContainer.select('.yAxis > g:first-of-type').select('line').attr('stroke', 'black').attr('stroke-opacity', 1);

    // color gridlines after coloring axes
    this.svgContainer.selectAll('.tick line').attr('stroke', this.gridlinesColor).attr('stroke-opacity', this.gridlinesOpacity);

    this.svgContainer.select('.yAxis > g:first-of-type').select('line').style('display', 'none');
}

  /**** This function draws the shape encoded on the data ****/
  selectShape(d: Point) {
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
  shapeTransform(d: Point) {
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

    return `translate(${(<d3Axis.AxisScale<d3Axis.AxisDomain>>this.xScale)(d.x)},
    ${(<d3Axis.AxisScale<d3Axis.AxisDomain>>this.yScale)(d.y)})` + `rotate(${rotation})`;
  }

  /**** This function sets scales on x and y axes based on fields selected *****/
  setScales(data: Point[]) {
    switch (this.xField.dataType) {
      default:
      case 'number':
        this.xScale = scaleLinear();
        this.xAxis = d3Axis.axisBottom(<d3Axis.AxisScale<d3Axis.AxisDomain>>this.xScale).tickSizeOuter(0);
        (<ScaleLinear<number, number>>this.xScale).domain([d3Array.min(data, (d: Point) => Number(d.x)),
           d3Array.max(data, (d: Point) => Number(d.x))]).range([0, this.elementWidth - this.maxYAxisTickWidth]);
        break;

      case 'string':
        this.xScale = scalePoint();
        this.xAxis = d3Axis.axisBottom((<d3Axis.AxisScale<d3Axis.AxisDomain>>this.xScale)).tickSizeOuter(0);
        (<ScalePoint<string>>this.xScale).domain(data.map(el => el.x).sort() as ReadonlyArray<string>)
        .range([0, this.elementWidth - this.maxYAxisTickWidth]);
        break;
    }

    switch (this.yField.dataType) {
      default:
      case 'number':
        this.yScale = scaleLinear();
        this.yAxis = d3Axis.axisLeft(<d3Axis.AxisScale<d3Axis.AxisDomain>>this.yScale).tickSizeOuter(0);
        (<ScaleLinear<number, number>>this.yScale).domain([d3Array.min(data,
          (d: Point) => Number(d.y)), d3Array.max(data, (d: Point) => Number(d.y))]).range([this.elementHeight, 0]);
        break;

      case 'string':
        this.yScale = scalePoint();
        this.yAxis = d3Axis.axisLeft(<d3Axis.AxisScale<d3Axis.AxisDomain>>this.yScale).tickSizeOuter(0);
        (<ScalePoint<string>>this.yScale).domain(data.map(el => el.y).sort().reverse() as ReadonlyArray<string>)
        .range([this.elementHeight, 0]);
        break;
    }

    this.transparencyScale = scaleLinear()
    .domain([0, 1])
    .range([1, 0]);
  }

  onMouseOver(targetId: any) {
    let tooltipText = '';
    this.svgContainer.selectAll('.plots').filter((d: any) => {
        if (d[idSymbol] === targetId) {
          if (this.enableTooltip && d.tooltip) {
            tooltipText = d.tooltip.toString();
          }
          return true;
        }
      });

    if (this.enableTooltip && tooltipText) {
      this.tooltipDiv.transition().style('opacity', .7).style('visibility', 'visible');

      this.tooltipDiv.html(tooltipText)
      .style('left', d3Selection.event.x - 50 + 'px').style('top',  d3Selection.event.y - 40 + 'px');
    }
  }

  onMouseOut(targetId: any) {
    const selection = this.svgContainer.selectAll('.plots').filter((d: Point) => d[idSymbol] === targetId);

    selection.transition().attr('d', d3Shape.symbol().size((d: Point) => d.size as number).type((d: Point) => this.selectShape(d)));

    if (this.enableTooltip) {
      this.tooltipDiv.style('opacity', 0).style('visibility', 'hidden');
    }
  }
}
