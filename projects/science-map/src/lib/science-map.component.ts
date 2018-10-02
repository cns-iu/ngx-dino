import {
  Component, OnInit, ElementRef, Input, Output, DoCheck,
  EventEmitter, OnChanges, SimpleChanges, ViewChild, SimpleChange
} from '@angular/core';

import {
  BoundField, RawChangeSet, Datum, idSymbol
} from '@ngx-dino/core';

import { Observable } from 'rxjs';

import * as d3Selection from 'd3-selection';
import { scaleLinear, scaleLog } from 'd3-scale';
import * as d3Array from 'd3-array';
import 'd3-transition';

import { ScienceMapDataService } from './shared/science-map-data.service';
import { Subdiscipline } from './shared/subdiscipline';


@Component({
  selector: 'dino-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.css']
})
export class ScienceMapComponent implements OnInit, OnChanges, DoCheck {
  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };
  @Input() width = window.innerWidth - this.margin.left - this.margin.right; // initializing width for map container
  @Input() height = window.innerHeight - this.margin.top - this.margin.bottom; // initializing height for map container
  @Input() autoresize = false;

  @Input() subdisciplineSizeField: BoundField<string>;
  @Input() subdisciplineIdField: BoundField<number|string>;

  @Input() dataStream: Observable<RawChangeSet<any>>;

  @Input() enableTooltip = false;
  @Input() tooltipTextField: BoundField<number|string>;

  @Input() nodeSizeRange = [2, 18];
  @Input() minPositionX = 0;
  @Input() minPositionY = -20;

  @Output() nodeClicked = new EventEmitter<any>();

  @ViewChild('scienceMapContainer') scienceMapElement: ElementRef;

  private svgContainer: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  private parentNativeElement: any;

  private nodes: any = [];
  private labels: any = [];

  private links: any;

  private translateXScale: any;
  private translateYScale: any;
  private nodeSizeScale: any;

  private subdIdToPosition: any;
  private subdIdToDisc: any;
  private discIdToColor: any;
  private subdIdToName: any;

  private tooltipDiv: any;
  private data: any[] = [];

  private defaultNodeSize = 4;

  private elementWidth = 0;
  private elementHeight = 0;

  // private zoom = d3Zoom.zoom().scaleExtent([1, 10]).on('zoom', this.zoomed);

  constructor(private element: ElementRef, private dataService: ScienceMapDataService) {
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() {
    this.setScales();
    this.initVisualization();
    this.createEdges();
    this.createLabels('white', 3);
    this.createLabels('black', 1);

    this.dataService.subdisciplines.subscribe((data) => {
      this.data = this.data.filter((e: Subdiscipline) => !data.remove
        .some((obj: Datum<Subdiscipline>) => obj[idSymbol] === e.id)).concat(data.insert.toArray() as any);

      data.update.forEach((el) => {
        const index = this.data.findIndex((e) => e.id === el[1].id);
        this.data[index] = Object.assign(this.data[index] || {}, <Subdiscipline>el[1]);
      });

      this.setScales();
      this.createNodes();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataStream' in changes && this.dataStream) {
      this.data = [];
      this.updateStreamProcessor(false);
    } else if (Object.keys(changes).filter((k) => k.endsWith('Field')).length) {
      this.updateStreamProcessor(); // TODO
      // updateField(....)
    }
    if ((!this.autoresize) && (('width' in changes) || ('height' in changes))) {
      this.resize(this.width, this.height);
    }
  }

  ngDoCheck() {
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
      this.createLabels('white', 3);
      this.createLabels('black', 1);
      this.createNodes();
    }
  }

  doResize({width, height}: {width: number, height: number}): void {
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
      this.dataService.updateData(this.subdisciplineIdField, this.subdisciplineSizeField);
    }

    if (!update) {
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
      .domain(d3Array.extent(this.dataService.underlyingScimapData.nodes, (d: any) => <number>d.x))
      .range([this.margin.left, this.elementWidth - this.margin.right]);

    this.translateYScale = scaleLinear()
      .domain(d3Array.extent(this.dataService.underlyingScimapData.nodes, (d: any) => <number>d.y))
      .range([this.elementHeight - this.margin.top, this.margin.bottom]);

    const nodeSizeScale = scaleLog()
      .domain(d3Array.extent(this.data, (d: any) => Math.max(1, parseInt(d.size, 10))))
      .range(this.nodeSizeRange);

    this.nodeSizeScale = (value) => nodeSizeScale(value < 1 ? 1 : value);
  }

  initVisualization() {
    // initializing svg container
    const container = d3Selection.select(this.parentNativeElement)
      .select('.science-map-container');

    this.svgContainer = container.append('svg')
      .attr('width', this.elementWidth)
      .attr('height', this.elementHeight)
      .classed('svg-content-responsive', true)
      .attr('class', 'scienceMapSvgcontainer');
        // .call(this.zoom);

    this.tooltipDiv = container.select('.tooltip');
  }

  createNodes() {
    this.nodes = this.svgContainer.selectAll('circle')
      .data<any>(this.data, (d) => d[idSymbol]);

    this.nodes.attr('r', (d) => this.nodeSizeScale(d.size));

    this.nodes.exit().remove();

    this.nodes.enter().append('g')
      .attr('class', (d) => 'node-g subd_id' + d[idSymbol])
      .append('circle')
      .attr('r', (d) => this.nodeSizeScale(d.size) || this.defaultNodeSize)
      .attr('class', (d) => 'node subd_id' + d[idSymbol])
      .attr('fill', (d) => this.dataService.underlyingScimapData.disciplines.filter(
        (d2) => d2.disc_id === this.dataService.subdIdToDisc[d[idSymbol]].disc_id)[0].color)
      .attr('stroke', 'black')
      .attr('x', (d) => this.translateXScale(this.dataService.subdIdToPosition[d[idSymbol]].x))
      .attr('y', (d) => this.translateYScale(this.dataService.subdIdToPosition[d[idSymbol]].y))
      .attr('transform', (d) => 'translate('
        + this.translateXScale(this.dataService.subdIdToPosition[d[idSymbol]].x)
        + ',' + this.translateYScale(this.dataService.subdIdToPosition[d[idSymbol]].y) + ')')
      .on('click', (d) => this.nodeClicked.emit(this.dataForSubdiscipline(<number>d[idSymbol])))
      .on('mouseover', (d) => this.enableTooltip ? this.onMouseOver(this.dataForSubdiscipline(<number>d[idSymbol])) : null)
      .on('mouseout', (d) => this.onMouseOut(this.dataForSubdiscipline(<number>d[idSymbol])));
  }

  createLabels(
    strokeColor: string,
    strokeWidth: number) {
    const numUnclassified = this.data.filter((entry) => entry[idSymbol] === -1);
    const numMultidisciplinary = this.data.filter((entry) => entry[idSymbol] === -2);

    this.svgContainer.selectAll('.underlyingLabels')
      .append('g')
      .data<any>(this.dataService.underlyingScimapData.labels).enter()
      .append('text')
      .attr('class', 'label')
      .attr('text-anchor', (d) => {
        const x = this.translateXScale(d.x);
        const m = d3Array.mean(this.translateXScale.range());
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
      .attr('stroke-opacity', 1)
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

  onMouseOver(target: any) {
    let tooltipText = '';
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: any) => {
        if (d[idSymbol] === target.subd_id) {
          tooltipText = d.tooltipText.toString();
          return true;
        }
      });

    selection.transition().attr('r', (d: any) => 2 * this.nodeSizeScale(d.size || 2 * this.defaultNodeSize));

    this.tooltipDiv.transition().style('opacity', .7)
        .style('visibility', 'visible');

    this.tooltipDiv.html(this.dataService.subdIdToName[tooltipText].subd_name) // TODO generic content needed
        .style('left', d3Selection.event.x - 50 + 'px')
        .style('top',  d3Selection.event.y - 40 + 'px');
  }

  onMouseOut(target: any) {
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: any) => d[idSymbol] === target.subd_id);
    selection.transition().attr('r', (d: any) => this.nodeSizeScale(d.size) || this.defaultNodeSize);

    this.tooltipDiv.style('opacity', 0)
      .style('visibility', 'hidden');
  }

  zoomed() {
    console.log('zooooomed!!');
  }

  dataForSubdiscipline(id: number): any {
    const result = {
      subd_id: id,
      subd_name: this.dataService.subdIdToName[id].subd_name,
      disc_name: undefined
    };

    const {disc_id} = this.dataService.subdIdToDisc[id];
    const {disc_name} = (this.dataService.underlyingScimapData.disciplines as any[]).find(
      (d) => d.disc_id === disc_id
    );

    result.disc_name = disc_name;

    return result;
  }
}
