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

import * as data from '../shared/copi.json'; // TODO streaming data instead of json file

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
  @Input() nodeColorField: string = 'total_amount'; // TODO Field
  @Input() nodeIDField: string = 'id'; // TODO Field or via Operator
  @Input() nodeLabelField: string = 'name'; // TODO Field
  @Input() labelSizeField: string = 'total_amount'; // TODO Field
  @Input() linkIDField: string = 'id'; // TODO Field or via Operator
  @Input() linkSizeField: string = 'number_of_grants'; // TODO Field
  @Input() linkColorField: string; // TODO Field
  @Input() linkOpacityField: string; // TODO Field
  @Input() nodeSizeRange = [5, 17];
  @Input() labelSizeRange = [16, 22];
  @Input() nodeColorRange = ['#FFFFFF','#3683BB','#3182BD'];
  @Input() linkSizeRange = [1, 8];
  @Input() linkColorRange = ['#FFFFFF','#3683BB','#3182BD'];
  @Input() linkOpacityRange = [.5, 1];

  private parentNativeElement: any;
  private svgContainer: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  private simulation: any; // TODO typings
  private nodes: any; // TODO typings
  private links: any; // TODO typings
  private labels: any; // TODO typings
  private nodeSizeScale: any; // TODO typings
  private labelSizeScale: any; // TODO typings
  private nodeColorScale: any; // TODO typings
  private linkSizeScale: any; // TODO typings
  private linkColorScale: any; // TODO typings
  private linkOpacityScale: any; // TODO typings
  
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

    this.labelSizeScale = scaleLinear()
    .domain([0, d3Array.max(data.nodes.data, (d) => Number(d[this.labelSizeField]))])
    .range(this.labelSizeRange);
    
    this.nodeColorScale = scaleLinear<string>()
     .domain([0, d3Array.max(data.nodes.data, 
        (d) => Number(d[this.nodeColorField]))/2, 
        d3Array.max(data.nodes.data, 
        (d) => Number(d[this.nodeColorField]))])
      .range(this.nodeColorRange);

    this.linkSizeScale = scaleLinear()
    .domain([0, d3Array.max(data.edges.data, (d) => Number(d[this.linkSizeField]))])
    .range(this.linkSizeRange);

    this.linkColorScale = scaleLinear<string>()
    .domain([0, d3Array.max(
      data.edges.data, (d) => Number(d[this.linkColorField]))/2, 
      d3Array.max(data.edges.data, 
      (d) => Number(d[this.linkColorField]))])
    .range(this.linkColorRange);

    this.linkOpacityScale = scaleLinear()
    .domain([0, d3Array.max(data.edges.data, 
      (d) => Number(d[this.linkOpacityField]) === undefined ? 1 : Number(d[this.linkOpacityField]))])
    .range(this.linkOpacityRange);
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
    // TODO update selection in case of streaming data
    this.links = this.svgContainer.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.edges.data)
      .enter().append('line')
      .attr('stroke-width', (d) => isNaN(this.linkSizeScale(d[this.linkSizeField])) ? 1 : this.linkSizeScale(d[this.linkSizeField]))
      .attr('stroke', (d) => this.linkColorScale(d[this.linkColorField]) === undefined ? 'black' : this.linkColorScale(d[this.linkColorField]))
      .attr('opacity', (d) => isNaN(this.linkOpacityScale(d[this.linkOpacityField])) ? 1 : this.linkOpacityScale(d[this.linkOpacityField]));

    this.links.exit().remove(); // links - exit selection

    this.nodes = this.svgContainer.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes.data)
      .enter().append('circle')
      .attr('r', (d) => isNaN(this.nodeSizeScale(d[this.nodeSizeField])) ? 10 : this.nodeSizeScale(d[this.nodeSizeField]))
      .attr('fill', (d) => this.nodeColorScale(d[this.nodeColorField]) === undefined ? 'green': this.nodeColorScale(d[this.nodeColorField]))   
      .attr('stroke', 'black') // no encoding on node stroke and stroke-size
      .attr('stroke-width', 1)
      .call(d3Drag.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended)); // TODO drag needs fixing
    
    this.labels = this.svgContainer.append('g').attr('class', 'labels')
      .selectAll('text').data(data.nodes.data, node => node[this.nodeIDField])
      .enter()
      .append('text')
      .text(node => this.toTitleCase(node[this.nodeLabelField]))
      .style('font-size', (d) => isNaN(this.labelSizeScale(d[this.labelSizeField])) ? 16 : this.labelSizeScale(d[this.labelSizeField]))
      .attr('dx', 15) // label position encoding is not supported yet
      .attr('dy', 10)

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
    if (!d3Selection.event.active) {
      this.simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }

  toTitleCase(label: string): string {
    return label.toLowerCase().split(' ').map(
      (word) => word.replace(word[0], word[0].toUpperCase())
    ).join(' ');
  }

}
