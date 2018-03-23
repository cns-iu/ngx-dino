import {
  Component,
  OnInit,
  ElementRef,
  Input,
  OnChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Changes, StreamCache } from '@ngx-dino/core';

import * as d3Selection from 'd3-selection';
import * as d3Force from 'd3-force';
import {
  scaleLinear, scaleQuantize
} from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Color from 'd3-color';
import * as d3Drag from 'd3-drag';
import * as d3Shape from 'd3-shape';

import * as data from '../shared/copi.json';

@Component({
  selector: 'dino-force-network',
  templateUrl: './force-network.component.html',
  styleUrls: ['./force-network.component.sass']
})
export class ForceNetworkComponent implements OnInit, OnChanges {
  // @Input() data: Array<number>; // TODO datastream
  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };
  @Input() width = window.innerWidth; // initializing width for map container
  @Input() height = window.innerHeight; // initializing height for map container
  @Input() nodeSizeField: string = 'number_of_grants'; // TODO Field
  @Input() nodeTextField: string = 'numPapers'; // TODO Field
  @Input() nodeColorField: string = 'total_amount'; // TODO Field
  @Input() nodeIDField: string = 'id'; // TODO Field or via Operator
  @Input() linkIDField: string = 'id'; // TODO Field or via Operator
  @Input() edgeSizeField: string = 'number_of_grants'; // TODO Field
  @Input() edgeColorField: string = 'value'; // TODO Field
  @Input() edgeOpacityField: string = 'value'; // TODO Field
  @Input() nodeSizeRange = [5,17];
  @Input() nodeTextSizeRange = [23, 35];
  @Input() nodeColorRange = ['#FFFFFF','#3182bd'];
  @Input() edgeSizeRange = [1,8];
  @Input() edgeColorRange = ['black'];
  @Input() edgeOpacityRange = [.5, 1];

  private parentNativeElement: any;
  private svgContainer: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  private simulation: any;
  private nodes: any;
  private links: any;
  private labels: any;
  private nodeSizeScale: any;
  private nodeTextScale: any;
  private nodeColorScale: any;
  private edgeSizeScale: any;
  private edgeColorScale: any;
  private edgeOpacityScale: any;
  
  constructor(element: ElementRef) {
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() {
    this.setScales();
    this.initVisualization();
    this.plotForceNetwork();
  }

  ngOnChanges() { }

  setScales() {
    this.nodeSizeScale = scaleLinear()
    .domain([0, d3Array.max(data.nodes.data, (d) => Number(d[this.nodeSizeField]))])
    .range(this.nodeSizeRange);

    this.nodeTextScale = scaleLinear()
    .domain([0, d3Array.max(data.nodes.data, (d) => Number(d[this.nodeTextField]))])
    .range(this.nodeTextSizeRange);
    
    this.nodeColorScale = scaleLinear<string>()
     .domain([0, d3Array.max(data.nodes.data, 
        (d) => Number(d[this.nodeColorField]))/2, 
        d3Array.max(data.nodes.data, 
        (d) => Number(d[this.nodeColorField]))])
      .range(this.nodeColorRange);

    this.edgeSizeScale = scaleLinear()
    .domain([0, d3Array.max(data.edges.data, (d) => Number(d[this.edgeSizeField]))])
    .range(this.edgeSizeRange);

    this.edgeColorScale = scaleLinear<string>()
    .domain([0, d3Array.max(
      data.edges.data, (d) => Number(d[this.edgeColorField]))/2, 
      d3Array.max(data.edges.data, 
      (d) => Number(d[this.edgeColorField]))])
    .range(this.edgeColorRange);

    this.edgeOpacityScale = scaleLinear()
    .domain([0, d3Array.max(data.edges.data, 
      (d) => Number(d[this.edgeOpacityField]) === undefined ? 1 : Number(d[this.edgeOpacityField]))])
    .range(this.edgeOpacityRange);
  }

  initVisualization() {
    // initializing svg container
    let container = d3Selection.select(this.parentNativeElement)
    .select('#forceNetworkContainer');
    
    this.svgContainer = container.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'container');
    
    this.simulation = d3Force.forceSimulation(data.nodes.data)
      .force('charge', d3Force.forceManyBody().theta(0))
      .force('link', d3Force.forceLink().distance(50)
        .id(link => link['id'])
        .strength(0.9))
      .force('center', d3Force.forceCenter(this.width/2.2, this.height/2));  
    this.simulation.velocityDecay(0.4);  
    this.simulation.alpha(0.9);
  
    }

  plotForceNetwork() {
    this.links = this.svgContainer.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.edges.data)
      .enter().append('line')
      .attr('stroke-width', (d) => isNaN(this.edgeSizeScale(
        d[this.edgeSizeField])) ? 1 : this.edgeSizeScale(d[this.edgeSizeField]))
      .attr('stroke', (d) => this.edgeColorScale(
        d[this.edgeColorField]) === undefined ? 'black' : this.edgeColorScale(d[this.edgeColorField]))
      .attr('opacity', (d) => isNaN(this.edgeOpacityScale(
        d[this.edgeOpacityField])) ? 1 : this.edgeOpacityScale(d[this.edgeOpacityField]));

    this.links.exit().remove(); // links - exit selection

    this.nodes = this.svgContainer.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes.data)
      .enter().append('circle')
      .attr('r', (d) => this.nodeSizeScale(d[this.nodeSizeField]))
      .attr('fill', (d) => this.nodeColorScale(d[this.nodeColorField]))   
      .call(d3Drag.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended));
    
    this.labels = this.svgContainer.append('g').attr('class', 'labels')
      .selectAll('text').data(data.nodes.data, node => node[this.nodeIDField])
      .enter()
      .append('text')
      .text(node => node['name'])
      .attr('font-size', 15)
      .attr('dx', 15)
      .attr('dy', 4)

    this.simulation.nodes(data.nodes.data).on('tick', () => this.ticked()); // TODO data
    this.simulation.force('link').links(data.edges.data); // TODO data
    this.simulation.restart();
  }
  

  ticked() {
    this.links.attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);
    
    this.nodes.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    this.labels.attr('x', node => node.x).attr('y', node => node.y);
  }


  dragstarted(d) {
    if (!d3Selection.event.active) {
      this.simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d) {
    d.fx = d3Selection.event.x;
    d.fy = d3Selection.event.y;
  }

  dragended(d) {
    this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

}
