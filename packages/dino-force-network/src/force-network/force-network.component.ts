import {
  Component,
  OnInit,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BoundField } from '@ngx-dino/core';

import * as d3Selection from 'd3-selection';
import * as d3Force from 'd3-force';
import { scaleLinear } from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Color from 'd3-color';
import * as d3Drag from 'd3-drag';
import * as d3Shape from 'd3-shape';
import 'd3-transition';

import * as data from '../shared/copi.json'; // TODO streaming data instead of json file

@Component({
  selector: 'dino-force-network',
  templateUrl: './force-network.component.html',
  styleUrls: ['./force-network.component.sass']
})
export class ForceNetworkComponent implements OnInit, OnChanges {
  @Input() dataNodes: any[]; // TODO datastream
  @Input() dataEdges: any[];
  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };
  @Input() width = window.innerWidth; // initializing width for map container
  @Input() height = window.innerHeight; // initializing height for map container
  @Input() nodeSizeField: BoundField<string>;
  @Input() nodeColorField: BoundField<number>; 
  @Input() nodeIDField: BoundField<string>;
  @Input() nodeLabelField: BoundField<string>; // TODO Field
  @Input() labelSizeField: string = 'total_amount'; // TODO Field
  @Input() linkIDField: string = 'id'; // TODO Field
  @Input() linkSizeField: BoundField<number>;
  @Input() linkColorField: string; // TODO Field
  @Input() linkOpacityField: string; // TODO Field
  @Input() nodeSizeRange = [5, 17];
  @Input() labelSizeRange = [16, 22];
  @Input() nodeColorRange: string[];
  @Input() linkSizeRange = [1, 8];
  @Input() linkColorRange = ['#FFFFFF','#3683BB','#3182BD'];
  @Input() linkOpacityRange = [.5, 1];
  @Input() minPositionX = 0;
  @Input() minPositionY = 0;

  @Input() chargeStrength = -10;

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
  private radius = 15
  
  constructor(element: ElementRef) {
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() {
    this.setScales();
    this.initVisualization();
    this.plotForceNetwork();
  }

  ngOnChanges(changes: SimpleChanges) {
    if('dataNodes' in changes) {
      this.initVisualization();
      this.setScales();
      this.plotForceNetwork();
    }
  }

  setScales() {
    this.nodeSizeScale = scaleLinear()
    .domain([0, d3Array.max(
      this.dataNodes, (d) => Number(this.nodeSizeField.get(d))
    )])
    .range(this.nodeSizeRange);

    this.labelSizeScale = scaleLinear()
    .domain([0, d3Array.max(this.dataNodes, (d) => Number(d[this.labelSizeField]))])
    .range(this.labelSizeRange);
    
    this.nodeColorScale = scaleLinear<string>()
     .domain([0,d3Array.max(this.dataNodes, (d) => this.nodeColorField.get(d))])
      .range(this.nodeColorRange);

    this.linkSizeScale = scaleLinear()
    .domain([0, d3Array.max(this.dataEdges, (d) => this.linkSizeField.get(d))])
    .range(this.linkSizeRange);

    this.linkColorScale = scaleLinear<string>()
    .domain([0, d3Array.max(
      this.dataEdges, (d) => Number(d[this.linkColorField]))/2, 
      d3Array.max(this.dataEdges, 
      (d) => Number(d[this.linkColorField]))])
    .range(this.linkColorRange);

    this.linkOpacityScale = scaleLinear()
    .domain([0, d3Array.max(this.dataEdges, 
      (d) => Number(d[this.linkOpacityField]) === undefined ? 1 : Number(d[this.linkOpacityField]))])
    .range(this.linkOpacityRange);
  }

  initVisualization() {
    d3Selection.select(this.parentNativeElement)
    .select('#forceNetworkContainer').select('svg').remove(); // remove and redraw, TODO needs changing
    
    // initializing svg container
    let container = d3Selection.select(this.parentNativeElement)
      .select('#forceNetworkContainer');

    this.svgContainer = container.append('svg')
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('viewBox', ''+ this.minPositionX +' '+ this.minPositionY +' ' + (this.width) + ' ' + (this.height))
      .classed('svg-content-responsive', true)
      .attr('class', 'container');

    this.simulation = d3Force.forceSimulation(this.dataNodes)
      .force('charge', d3Force.forceManyBody().strength(this.chargeStrength))
      .force('link', d3Force.forceLink().distance(75)
        .id(link => link['id'])
        .strength(1))
      .force('center', d3Force.forceCenter(this.width/2.2, this.height/2))
    this.simulation.velocityDecay(0.4);  
    this.simulation.alpha(0.9);
    this.simulation.restart();
    }

  plotForceNetwork() {
    // TODO update selection in case of streaming data
    this.links = this.svgContainer.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.dataEdges)
      .enter().append('line')
      .attr('stroke-width', (d) => isNaN(this.linkSizeScale(this.linkSizeField.get(d))) ? 1 : this.linkSizeScale(this.linkSizeField.get(d)))
      .attr('stroke', (d) => this.linkColorScale(d[this.linkColorField]) === undefined ? 'black' : this.linkColorScale(d[this.linkColorField]))
      .attr('opacity', (d) => isNaN(this.linkOpacityScale(d[this.linkOpacityField])) ? 1 : this.linkOpacityScale(d[this.linkOpacityField]));

    this.links.exit().remove(); // links - exit selection

    this.nodes = this.svgContainer.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.dataNodes)
      .enter().append('circle')
      .attr('id', (d) => this.nodeIDField.get(d))
      .attr('r', (d) => isNaN(this.nodeSizeScale(this.nodeSizeField.get(d))) ? 10 : this.nodeSizeScale(this.nodeSizeField.get(d)))
      .attr('fill', (d) => this.nodeColorScale(this.nodeSizeField.get(d)) === undefined ? 'green': this.nodeColorScale(this.nodeSizeField.get(d)))   
      .attr('stroke', 'black') // no encoding on node stroke and stroke-size
      .attr('stroke-width', 1)
      .call(d3Drag.drag()
        .on('start', this.dragstarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragended.bind(this))); // TODO drag needs fixing
        // TODO zooming
    
    this.nodes.on('mouseover', (d) => this.onMouseOver(this.nodeIDField.get(d)));
    this.nodes.on('mouseout', (d) => this.onMouseOut(this.nodeIDField.get(d)));

    this.labels = this.svgContainer.append('g').attr('class', 'labels')
      .selectAll('text').data(this.dataNodes, node => this.nodeIDField.get(node))
      .enter()
      .append('text')
      .text(node => this.nodeLabelField.get(node))
      .style('font-size', (d) => isNaN(this.labelSizeScale(d[this.labelSizeField])) ? 16 : this.labelSizeScale(d[this.labelSizeField]))
      .attr('dx', 15) // label position encoding is not supported yet
      .attr('dy', 10);

    this.simulation.nodes(this.dataNodes).on('tick', () => this.ticked());
    this.simulation.force('link').links(this.dataEdges);
    // this.simulation.restart();  
  }
  
  ticked() {
    this.nodes.attr('cx', (d) => d.x = Math.max(this.radius, Math.min(this.width - this.radius, d.x)))
      .attr('cy', (d) => d.y = Math.max(this.radius, Math.min(this.height - this.radius, d.y)));
    
    this.labels.attr('x', node => node.x = Math.max(this.radius, Math.min(this.width - this.radius, node.x)))
      .attr('y', node => node.y = Math.max(this.radius, Math.min(this.height - this.radius, node.y)));
    
    this.links.attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);
  }
  
  dragstarted(d) {
    if (!d3Selection.event.active) {
      this.simulation.alphaTarget(0.3)
      .force('charge', d3Force.forceManyBody().strength(-5))
      .restart();
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

  onMouseOver(targetID: any) {
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: any) => this.nodeIDField.get(d) === targetID);
    selection.transition().attr('r', (d) => 2 * this.nodeSizeScale(this.nodeSizeField.get(d)));

    const textSelection = this.svgContainer.selectAll('text')
      .filter((d: any) => this.nodeIDField.get(d) == targetID);
    textSelection.transition().style('font-size', (d) => isNaN(this.labelSizeScale(d[this.labelSizeField])) ? '32px' : 2 * this.labelSizeScale(d[this.labelSizeField]))
    .attr('dx', 30)
    .attr('dy', 20);
  }

  onMouseOut(targetID: any) {
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: any) => this.nodeIDField.get(d) === targetID);
    selection.transition().attr('r', (d) => this.nodeSizeScale(this.nodeSizeField.get(d)));

    const textSelection = this.svgContainer.selectAll('text')
      .filter((d: any) => this.nodeIDField.get(d) == targetID);
    textSelection.transition().style('font-size', (d) => isNaN(this.labelSizeScale(d[this.labelSizeField])) ? '16px' : this.labelSizeScale(d[this.labelSizeField]))
    .attr('dx', 15)
    .attr('dy', 10);
  }
}
