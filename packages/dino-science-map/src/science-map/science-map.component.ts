import {
  Component,
  OnInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Changes, StreamCache, BoundField } from '@ngx-dino/core';

import * as d3Selection from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import * as d3Array from 'd3-array';
import 'd3-transition'; 
import * as d3Zoom from 'd3-zoom';

import { ScienceMapDataService } from '../shared/science-map-data.service';
import { Observable } from 'apollo-link';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'dino-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.sass'],
  providers: [ScienceMapDataService]
})
export class ScienceMapComponent implements OnInit, OnChanges {
  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };
  @Input() width = window.innerWidth - 20; // initializing width for map container
  @Input() height = window.innerHeight - 100; // initializing height for map container
  @Input() subdisciplineSizeField: BoundField<string>;
  @Input() subdisciplineIDField: BoundField<number|string>;
  @Input() data: any[];
  @Output() nodeClicked = new EventEmitter<any>();

  private parentNativeElement: any;
  private svgContainer: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  private nodes: any;
  private defaultNodeSize = 4;
  private defaultNodeSizeRange = [4, 14];
  private labels: any;
  private links: any;
  private translateXScale: any;
  private translateYScale: any;
  private nodeSizeScale: any;
  private subdIdToPosition: any;
  private subdIdToDisc: any;
  private discIdToColor: any;
  private subdIdToName: any;
  private zoom = d3Zoom.zoom().scaleExtent([1, 10]).on('zoom', this.zoomed);

  constructor(element: ElementRef, private dataService: ScienceMapDataService) { 
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() {
  } 


  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'data' && this[propName]) {
        this.setScales();
        this.initVisualization();
        this.createNodes();
        this.createEdges();
        this.createLabels('black', 17);
      }
    }
  }
  
  setScales() {
    this.translateXScale = scaleLinear()
      .domain(d3Array.extent(this.dataService.underlyingScimapData.nodes, (d: any) => <number>d.x))
      .range([10, this.width - 10]);
      
    this.translateYScale = scaleLinear()
      .domain(d3Array.extent(this.dataService.underlyingScimapData.nodes, (d: any) => <number>d.y))
      .range([this.height - 10, 10]);
    
    this.nodeSizeScale = scaleLinear()
      .domain(d3Array.extent(this.data, (d: any) => parseInt(this.subdisciplineSizeField.get(d))))
      .range(this.defaultNodeSizeRange);
  }

  initVisualization() { 
    d3Selection.select(this.parentNativeElement)
    .select('#scienceMapContainer').select('svg').remove();

    // initializing svg container
    let container = d3Selection.select(this.parentNativeElement)
      .select('#scienceMapContainer');

    this.svgContainer = container.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('background', 'white')
      .attr('id', 'scienceMapcontainer')
      .call(this.zoom);
  }

  createNodes() {
    this.nodes = this.svgContainer.selectAll('.underlyingNodes')
      .data<any>(this.data);
    
    this.nodes.enter().append('g')
      .attr('class', (d) => 'node-g subd_id' + this.subdisciplineIDField.get(d))
      .attr('transform', (d) => 'translate(' + this.translateXScale(this.dataService.subdIdToPosition[this.subdisciplineIDField.get(d)].x) 
          + ',' + this.translateYScale(this.dataService.subdIdToPosition[this.subdisciplineIDField.get(d)].y) + ')')
      .append('circle')
      .attr('r', (d) => this.nodeSizeScale(this.subdisciplineSizeField.get(d)) || this.defaultNodeSize)
      .attr('class', (d) => 'node subd_id' + this.subdisciplineIDField.get(d))
      .attr('fill', (d) => this.dataService.underlyingScimapData.disciplines.filter(
        (d2) => d2.disc_id === this.dataService.subdIdToDisc[this.subdisciplineIDField.get(d)].disc_id)[0].color)
      .attr('stroke', 'black')
      .on('click', (d) => this.nodeClicked.emit(d))
      .on('mouseover', (d) => this.onMouseOver(d))
      .on('mouseout', (d) => this.onMouseOut(d));
     
      this.svgContainer.append('g').attr('class', 'labels')
      .selectAll('text').data<any>(this.dataService.underlyingScimapData.nodes).enter()
      .append('text')
      .attr('class', 'subd subd_label')
      .text((d) => this.dataService.subdIdToName[this.subdisciplineIDField.get(d)].subd_name)
      .attr('x', (d) => this.translateXScale(d.x))
      .attr('y', (d) => this.translateYScale(d.y))
      .attr('dx', 10)
      .attr('dy', 30)
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .attr('display', 'none');
  }

  createLabels(strokeColor: string, fontSize: number) {
    this.svgContainer.selectAll('.underlyingLabels')
      .append('g')
      .data<any>(this.dataService.underlyingScimapData.labels).enter()
      .append('text')
      .attr('class', 'label')
      .attr('text-anchor', (d) => {
        let x = this.translateXScale(d.x);
        let m = d3Array.mean(this.translateXScale.range())
        if (x > m) {
          return 'end';
        } else if (x < m) {
          return 'start';
          }
          return 'middle'
        })
      .attr('x', (d) => this.translateXScale(d.x))
      .attr('y', (d) => this.translateYScale(d.y))
      .style('fill', (d) => d.color)
      .attr('stroke', strokeColor)
      .attr('font-size', fontSize)
      .text((d) => d.disc_name)
      .style('pointer-events', 'none');
  }

  createEdges() {
    let sourceNode:any;
    let targetNode: any;
    this.links = this.svgContainer.insert('g', ':first-child').selectAll('line')
      .attr('class', 'links')
      .data<any>(this.dataService.underlyingScimapData.edges)
      .enter().append('line')
      .attr('class', (d1) => 'edge s' + d1.subd_id1 + ' t' + d1.subd_id2)
      .attr('stroke', '#9b9b9b')
      .attr('stroke-width', '1px')
      .attr('opacity', 0.5)
      .attr('x1', (d) => this.translateXScale(this.dataService.subdIdToPosition[d.subd_id1].x))
      .attr('y1', (d) => this.translateYScale(this.dataService.subdIdToPosition[d.subd_id1].y))
      .attr('x2', (d) => this.translateXScale(this.dataService.subdIdToPosition[d.subd_id2].x))
      .attr('y2', (d) => this.translateYScale(this.dataService.subdIdToPosition[d.subd_id2].y));
  }

  onMouseOver(target: any) {
    const selection = this.svgContainer.selectAll('circle')
    .filter((d: any) => this.subdisciplineIDField.get(d) === this.subdisciplineIDField.get(target));
    selection.transition().attr('r', (d) => 2 * this.nodeSizeScale(this.subdisciplineSizeField.get(d) || 2 * this.defaultNodeSize));
    
    const textSelection = this.svgContainer.selectAll('.subd_label')
    .filter((d: any) => this.subdisciplineIDField.get(d) === target.subd_id);
    textSelection.transition().attr('display', 'block');
  }

  onMouseOut(target: any) {
    const selection = this.svgContainer.selectAll('circle')
    .filter((d: any) => this.subdisciplineIDField.get(d) === this.subdisciplineIDField.get(target));
    selection.transition().attr('r', (d) => this.nodeSizeScale(this.subdisciplineSizeField.get(d)) || this.defaultNodeSize);  
    
    const textSelection = this.svgContainer.selectAll('.subd_label')
    .filter((d: any) => this.subdisciplineIDField.get(d) === target.subd_id);
    textSelection.transition().attr('display', 'none');
  }

  zoomed() {
    console.log('zooooomed!!');
    // this.svgContainer.attr('transform', 'translate(' + this.zoom.translate() + ")scale(" + scope.zoom.scale() + ")");
  }

}