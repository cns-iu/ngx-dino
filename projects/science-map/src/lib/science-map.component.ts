import 'd3-transition';

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BoundField, ChangeSet, Datum, DatumId, idSymbol, NgxDinoEvent, RawChangeSet, rawDataSymbol } from '@ngx-dino/core';
import { extent, mean } from 'd3-array';
import { ScaleContinuousNumeric, scaleLinear, scaleLog } from 'd3-scale';
import * as d3Selection from 'd3-selection';
import { Set } from 'immutable';
import { uniqBy } from 'lodash';
import { Observable } from 'rxjs';

import { ScienceMapDataService } from './shared/science-map-data.service';
import { SubdisciplineDatum } from './shared/subdiscipline';


@Component({
  selector: 'dino-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.css'],
  providers: [ScienceMapDataService]
})
export class ScienceMapComponent implements OnInit, OnChanges {
  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };
  @Input() width = window.innerWidth - this.margin.left - this.margin.right; // initializing width for map container
  @Input() height = window.innerHeight - this.margin.top - this.margin.bottom; // initializing height for map container
  @Input() autoresize = false;

  @Input() subdisciplineSizeField: BoundField<string>;
  @Input() subdisciplineIdField: BoundField<DatumId>;

  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() enableTooltip = false;
  @Input() tooltipTextField: BoundField<DatumId>;

  @Input() nodeSizeRange = [2, 18];
  @Input() minPositionX = 0;
  @Input() minPositionY = -20;

  @Output() nodeClick = new EventEmitter<NgxDinoEvent>();

  @ViewChild('scienceMapContainer', { static: true }) scienceMapElement: ElementRef;

  private svgContainer: d3Selection.Selection<SVGSVGElement, any, HTMLDivElement, any>;
  private parentNativeElement: HTMLElement;

  private nodes: d3Selection.Selection<SVGCircleElement, SubdisciplineDatum, SVGElement, any>;
  private links: d3Selection.Selection<SVGLineElement, SubdisciplineDatum, SVGElement, any>;

  private translateXScale: ScaleContinuousNumeric<number, number>;
  private translateYScale: ScaleContinuousNumeric<number, number>;
  private nodeSizeScale: (value: number) => number;

  private tooltipDiv: d3Selection.Selection<HTMLDivElement, any, HTMLDivElement, any>;
  private data: SubdisciplineDatum[] = [];

  private defaultNodeSize = 4;

  private elementWidth = 0;
  private elementHeight = 0;

  // private zoom = d3Zoom.zoom().scaleExtent([1, 10]).on('zoom', this.zoomed);

  constructor(element: ElementRef, private dataService: ScienceMapDataService) {
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    this.setScales();
    this.initVisualization();
    this.createEdges();
    this.createLabels('white', 3);
    this.createLabels('#000007', 1);

    this.dataService.subdisciplines.subscribe((changes) => {
      this.data = this.applyChangeSet(changes, this.data);

      this.setScales();
      this.createNodes();
      this.createLabels('white', 3);
      this.createLabels('#000007', 1);
    });
  }

  private applyChangeSet<T extends Datum>(set: ChangeSet<any>, data: T[]): T[] {
    const removeIds = set.remove.map(rem => Number(rem[idSymbol]));
    const replaceIds = set.replace.map(rep => Number(rep[idSymbol]));
    const filteredIds = Set<DatumId>().merge(removeIds, replaceIds);
    const filtered = data.filter(item => !filteredIds.has(Number(item[idSymbol])));
    const appliedData = filtered.concat(set.insert.toArray() as T[], set.replace.toArray() as T[]);
    const uniqueData = uniqBy(appliedData.reverse(), idSymbol).reverse();

    // Only keep subdiscipline data with valid sizes
    const subdData = uniqueData.filter(item => this.dataService.subdIdToPosition.hasOwnProperty(item[idSymbol]));
    // Set default 'size' to zero
    subdData.forEach(item => item['size'] = item['size'] || 0);
    return subdData;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataStream' in changes || 'idField' in changes) {
      this.data = [];
      this.updateStreamProcessor(false);
    } else if (Object.keys(changes).filter((k) => k.endsWith('Field')).length) {
      this.updateStreamProcessor();
    }
    if ((!this.autoresize) && (('width' in changes) || ('height' in changes))) {
      this.resize(this.width, this.height);
    }
  }

  resize(width: number, height: number): void {
    if (width !== this.elementWidth || height !== this.elementHeight) {
      this.elementWidth = width;
      this.elementHeight = height;

      if (this.svgContainer) {
        this.svgContainer.remove();
      }

      this.setScales();
      this.initVisualization();
      this.createEdges();
      this.createNodes();
      this.createLabels('white', 3);
      this.createLabels('#000007', 1);
    }
  }

  doResize({ width, height }: { width: number, height: number }): void {
    if (this.autoresize) {
      const wDiff = width - this.elementWidth;
      const hDiff = height - this.elementHeight;
      const newW = 0 < wDiff && wDiff < 25 ? this.elementWidth : width;
      const newH = 0 < hDiff && hDiff < 25 ? this.elementHeight : height;
      this.resize(newW, newH);
    }
  }

  updateStreamProcessor(update = true) {
    if (update) {
      this.dataService.updateData(
        this.subdisciplineIdField,
        this.subdisciplineSizeField,
        this.tooltipTextField
      );
    } else {
      this.dataService.fetchData(
        this.dataStream,
        this.subdisciplineIdField,
        this.subdisciplineSizeField,
        this.tooltipTextField
      );
    }
  }

  setScales() {
    this.translateXScale = scaleLinear()
      .domain(extent(this.dataService.underlyingScimapData.nodes, (d: any) => <number>d.x))
      .range([this.margin.left, this.elementWidth - this.margin.right]);

    this.translateYScale = scaleLinear()
      .domain(extent(this.dataService.underlyingScimapData.nodes, (d: any) => <number>d.y))
      .range([this.elementHeight - this.margin.top, this.margin.bottom]);

    const nodeSizeScale = scaleLog()
      .domain(extent(this.data, (d: any) => Math.max(1, parseInt(d.size, 10))))
      .range(this.nodeSizeRange);

    this.nodeSizeScale = (value: number) => nodeSizeScale(value < 1 ? 1 : value);
  }

  initVisualization() {
    // initializing svg container
    const container = d3Selection.select(this.parentNativeElement)
      .select<HTMLDivElement>('.science-map-container');

    this.svgContainer = container.append('svg')
      .attr('width', this.elementWidth)
      .attr('height', this.elementHeight)
      .classed('svg-content-responsive', true)
      .attr('class', 'scienceMapSvgcontainer');
        // .call(this.zoom);

    this.tooltipDiv = container.select('.tooltip');
  }

  createNodes() {
    this.nodes = this.svgContainer.selectAll<SVGCircleElement, SubdisciplineDatum>('circle')
      .data(this.data, ((d: SubdisciplineDatum) => d[idSymbol]) as any);

    this.nodes.attr('r', (d) => this.nodeSizeScale(d.size));

    this.nodes.exit().remove();

    this.nodes.enter().append('g')
      .attr('class', (d) => 'node-g subd_id' + d[idSymbol])
      .append('circle')
      .attr('r', (d) => this.nodeSizeScale(d.size) || this.defaultNodeSize)
      .attr('class', (d) => 'node subd_id' + d[idSymbol])
      .attr('fill', (d) => this.dataService.underlyingScimapData.disciplines.filter(
        (d2) => d2.disc_id === this.dataService.subdIdToDisc[d[idSymbol]].disc_id)[0].color)
      .attr('stroke', '#000007')
      .attr('fill-opacity', 0.75)
      .attr('stroke-opacity', 1)
      .attr('x', (d) => this.translateXScale(this.dataService.subdIdToPosition[d[idSymbol]].x))
      .attr('y', (d) => this.translateYScale(this.dataService.subdIdToPosition[d[idSymbol]].y))
      .attr('transform', (d) => 'translate('
        + this.translateXScale(this.dataService.subdIdToPosition[d[idSymbol]].x)
        + ',' + this.translateYScale(this.dataService.subdIdToPosition[d[idSymbol]].y) + ')')
      .on('click', (d) => this.nodeClicked(d, d3Selection.event))
      .on('mouseover', (d) => this.enableTooltip ? this.onMouseOver(d) : null)
      .on('mouseout', (d) => this.onMouseOut(d));
  }

  createLabels(strokeColor: string, strokeWidth: number) {
    const numUnclassified = this.data.filter((entry) => entry[idSymbol] === -1);
    const numMultidisciplinary = this.data.filter((entry) => entry[idSymbol] === -2);

    this.svgContainer.selectAll('.underlyingLabels')
      .append('g')
      .data<any>(this.dataService.underlyingScimapData.labels).enter()
      .append('text')
      .attr('class', 'label')
      .attr('text-anchor', (d) => {
        const x = this.translateXScale(d.x);
        const m = mean(this.translateXScale.range());
        if (x > m) {
          return 'end';
        } else if (x < m) {
          return 'start';
          }
          return 'middle';
        })
      .attr('x', (d) => this.translateXScale(d.x))
      .attr('y', (d) => this.translateYScale(d.y))
      .style('fill', (d) => d.color)
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth)
      .attr('font-size', 17)
      .attr('fill-opacity', 0.75)
      .attr('stroke-opacity', 0.9)
      .attr('display', (d) => {
        if (((numUnclassified.length === 0) && (d.disc_id === -1)) || ((numMultidisciplinary.length === 0) && (d.disc_id === -2))) {
          return 'none';
        } else {
          return 'block';
        }
      })
      .text((d) => d.disc_name)
      .style('pointer-events', 'none');
  }

  createEdges() {
    this.links = this.svgContainer.insert('g', ':first-child').selectAll('line')
      .attr('class', 'links')
      .data<any>(this.dataService.underlyingScimapData.edges)
      .enter().append('line')
      .attr('class', (d1) => 'edge s' + d1.subd_id1 + ' t' + d1.subd_id2)
      .attr('stroke', '#9b9b9b')
      .attr('stroke-width', 1)
      .attr('opacity', 0.5)
      .attr('x1', (d) => this.translateXScale(this.dataService.subdIdToPosition[d.subd_id1].x))
      .attr('y1', (d) => this.translateYScale(this.dataService.subdIdToPosition[d.subd_id1].y))
      .attr('x2', (d) => this.translateXScale(this.dataService.subdIdToPosition[d.subd_id2].x))
      .attr('y2', (d) => this.translateYScale(this.dataService.subdIdToPosition[d.subd_id2].y));
  }

  nodeClicked(data: SubdisciplineDatum, event: Event): void {
    this.nodeClick.emit(new NgxDinoEvent(event, data[rawDataSymbol], data, this));
  }

  onMouseOver(target: SubdisciplineDatum) {
    const tooltip = target.tooltipText || target.subdisciplineName;

    this.tooltipDiv.transition().style('opacity', .7)
        .style('visibility', 'visible');
    this.tooltipDiv.html(tooltip)
        .style('left', d3Selection.event.x - 50 + 'px')
        .style('top',  d3Selection.event.y - 40 + 'px');
  }

  onMouseOut(target: SubdisciplineDatum) {
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: any) => d[idSymbol] === target[idSymbol]);
    selection.transition().attr('r', (d: any) => this.nodeSizeScale(d.size) || this.defaultNodeSize);

    this.tooltipDiv.style('opacity', 0)
      .style('visibility', 'hidden');
  }

  zoomed() {
    console.log('zooooomed!!');
  }
}
