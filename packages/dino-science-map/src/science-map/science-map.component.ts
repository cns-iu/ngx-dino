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
import { scaleLinear, scaleLog } from 'd3-scale';
import * as d3Array from 'd3-array';
import 'd3-transition';
import * as d3Zoom from 'd3-zoom';


import { ScienceMapDataService } from '../shared/science-map-data.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'dino-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.sass'],
  providers: [ScienceMapDataService]
})
export class ScienceMapComponent implements OnInit, OnChanges {
  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };
  @Input() width = window.innerWidth - this.margin.left - this.margin.right; // initializing width for map container
  @Input() height = window.innerHeight - this.margin.top - this.margin.bottom; // initializing height for map container
 
  @Input() subdisciplineSizeField: BoundField<string>;
  @Input() subdisciplineIdField: BoundField<number|string>;
 
  @Input() data: any[];
 
  @Input() nodeSizeRange = [2, 18];
  @Input() minPositionX = 0;
  @Input() minPositionY = -20;
  
  @Input() enableTooltip = false;
  @Input() tooltipTextField: BoundField<number|string>;
  
  @Output() nodeClicked = new EventEmitter<any>();

  private parentNativeElement: any;
  private svgContainer: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  
  private nodes: any;
  private defaultNodeSize = 4;
  private labels: any;
  
  private links: any;
  
  private translateXScale: any;
  private translateYScale: any;
  private nodeSizeScale: any;
  
  private subdIdToPosition: any;
  private subdIdToDisc: any;
  private discIdToColor: any;
  private subdIdToName: any;
  
  private tooltipDiv: any;
  // private zoom = d3Zoom.zoom().scaleExtent([1, 10]).on('zoom', this.zoomed);

  constructor(element: ElementRef, private dataService: ScienceMapDataService) {
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
      if ('data' in changes && this.data.length !== 0) {
        this.setScales();
        this.initVisualization();
        this.createNodes();
        this.createEdges();
        this.createLabels('black', 17);
      }
  }

  setScales() {
    this.translateXScale = scaleLinear()
      .domain(d3Array.extent(this.dataService.underlyingScimapData.nodes, (d: any) => <number>d.x))
      .range([0, this.width]);

    this.translateYScale = scaleLinear()
      .domain(d3Array.extent(this.dataService.underlyingScimapData.nodes, (d: any) => <number>d.y))
      .range([this.height, 0]);

    const nodeSizeScale = scaleLog()
      .domain(d3Array.extent(this.data, (d: any) => Math.max(1, parseInt(this.subdisciplineSizeField.get(d)))))
      .range(this.nodeSizeRange);

    this.nodeSizeScale = (value) => nodeSizeScale(value < 1 ? 1 : value);
  }

  initVisualization() {
    d3Selection.select(this.parentNativeElement)
      .select('#scienceMapContainer').select('svg').remove();

    // initializing svg container
    let container = d3Selection.select(this.parentNativeElement)
      .select('#scienceMapContainer');

    this.svgContainer = container.append('svg')
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('viewBox', ''+ this.minPositionX +' '+ this.minPositionY +' ' + (this.width) + ' ' + (this.height))
      .classed('svg-content-responsive', true)
      .attr('id', 'scienceMapcontainer');
        // .call(this.zoom);

    this.tooltipDiv = container.select('#tooltip');
  }

  createNodes() {
    this.nodes = this.svgContainer.selectAll('.underlyingNodes')
      .data<any>(this.data, (d) => <any>this.subdisciplineIdField.get(d));

    this.nodes.selectAll('circle')
      .transition().attr('r', (d) => this.nodeSizeScale(this.subdisciplineSizeField.get(d)));

    this.nodes.enter().append('g')
      .attr('class', (d) => 'node-g subd_id' + this.subdisciplineIdField.get(d))
      .append('circle')
      .attr('r', (d) => this.nodeSizeScale(this.subdisciplineSizeField.get(d)) || this.defaultNodeSize)
      .attr('class', (d) => 'node subd_id' + this.subdisciplineIdField.get(d))
      .attr('fill', (d) => this.dataService.underlyingScimapData.disciplines.filter(
        (d2) => d2.disc_id === this.dataService.subdIdToDisc[this.subdisciplineIdField.get(d)].disc_id)[0].color)
      .attr('stroke', 'black')
      .attr('x', (d) => this.translateXScale(this.dataService.subdIdToPosition[this.subdisciplineIdField.get(d)].x))
      .attr('y', (d) => this.translateYScale(this.dataService.subdIdToPosition[this.subdisciplineIdField.get(d)].y))
      .attr('transform', (d) => 'translate(' 
        + this.translateXScale(this.dataService.subdIdToPosition[this.subdisciplineIdField.get(d)].x)
        + ',' + this.translateYScale(this.dataService.subdIdToPosition[this.subdisciplineIdField.get(d)].y) + ')')
      .on('click', (d) => this.nodeClicked.emit(this.dataForSubdiscipline(<number>this.subdisciplineIdField.get(d))))
      .on('mouseover', (d) => this.enableTooltip? this.onMouseOver(this.dataForSubdiscipline(<number>this.subdisciplineIdField.get(d))): null)
      .on('mouseout', (d) => this.onMouseOut(this.dataForSubdiscipline(<number>this.subdisciplineIdField.get(d))));

    this.nodes.exit().remove();
  }

  createLabels(strokeColor: string, fontSize: number) {
    const numUnclassified = this.data.filter((entry) => this.subdisciplineIdField.get(entry) == -1);
    const numMultidisciplinary = this.data.filter((entry) => this.subdisciplineIdField.get(entry) == -2);
        
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
      .attr('display', (d) => {
        if (((numUnclassified.length === 0) && (d.disc_id === -1)) || ((numMultidisciplinary.length === 0) && (d.disc_id === -2))) {
          return 'none';
        }else {
          return 'block';
        }
      })
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
    let tooltipText = '';
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: any) => {
        if (this.subdisciplineIdField.get(d) === target.subd_id) {
          tooltipText = this.tooltipTextField.get(d).toString();
          return true;
        }
      });
    
    selection.transition().attr('r', (d) => 2 * this.nodeSizeScale(this.subdisciplineSizeField.get(d) || 2 * this.defaultNodeSize));
    
    this.tooltipDiv.transition().style('opacity', .7)
        .style('visibility', 'visible');		
    
    this.tooltipDiv.html(this.dataService.subdIdToName[tooltipText].subd_name) // TODO generic content needed
        .style('left', d3Selection.event.x - 50 + 'px')		
        .style('top',  d3Selection.event.y - 40+ 'px');
  }

  onMouseOut(target: any) {
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: any) => this.subdisciplineIdField.get(d) === target.subd_id);
    selection.transition().attr('r', (d) => this.nodeSizeScale(this.subdisciplineSizeField.get(d)) || this.defaultNodeSize);

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
      (d) => d.disc_id == disc_id
    );

    result.disc_name = disc_name;

    return result;
  }
}
