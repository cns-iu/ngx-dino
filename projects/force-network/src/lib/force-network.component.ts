import {
  Component,
  OnInit,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';

import { BoundField, RawChangeSet, idSymbol, Datum } from '@ngx-dino/core';

import { Observable } from 'rxjs';

import * as d3Selection from 'd3-selection';
import * as d3Force from 'd3-force';
import { scaleLinear } from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Drag from 'd3-drag';
import 'd3-transition';

import { Node, Link } from './shared/network';
import { ForceNetworkDataService } from './shared/force-network-data.service';
import { transition } from 'd3-transition';

@Component({
  selector: 'dino-force-network',
  templateUrl: './force-network.component.html',
  styleUrls: ['./force-network.component.css'],
  providers: [ForceNetworkDataService]
})
export class ForceNetworkComponent implements OnInit, OnChanges {
  @Input() nodeStream: Observable<RawChangeSet<any>>;
  @Input() linkStream: Observable<RawChangeSet<any>>;

  @Input() margin = { top: 20, right: 15, bottom: 60, left: 60 };
  @Input() width = 0;
  @Input() height = 0;
  @Input() autoresize = false;
  @Input() runSimulation = true;

  @Input() nodeSizeField: BoundField<string>;
  @Input() nodeColorField: BoundField<number>;
  @Input() nodeIdField: BoundField<string>;
  @Input() nodeLabelField: BoundField<string>;
  @Input() labelSizeField = 'total_amount'; // TODO Field
  @Input() nodeFixedXField: BoundField<number>;
  @Input() nodeFixedYField: BoundField<number>;

  @Input() linkIdField: BoundField<string>;
  @Input() linkSourceField: BoundField<string>;
  @Input() linkTargetField: BoundField<string>;
  @Input() linkSizeField: BoundField<number>;
  @Input() linkColorField: string; // TODO Field
  @Input() linkTransparencyField: BoundField<number>; // TODO Field

  @Input() strokeTransparencyField: BoundField<number>;
  @Input() tooltipTextField: BoundField<number | string>;
  @Input() enableTooltip = false;

  @Input() nodeSizeRange = [5, 15];
  @Input() labelSizeRange = [16, 22];
  @Input() nodeColorRange: string[];
  @Input() nodeTransparencyField: BoundField<number>;
  @Input() nodeTransparencyRange = [0, 1];

  @Input() strokeTransparencyRange = [0, 1];

  @Input() linkSizeRange = [1, 8];
  @Input() linkColorRange = ['#FFFFFF', '#3182BD'];
  @Input() linkTransparencyRange = [0, 1];

  @Input() minPositionX = 0;
  @Input() minPositionY = -20;

  @Input() chargeStrength = -10;
  @Input() linkDistance = 105;

  private elementWidth = 0;
  private elementHeight = 0;

  private parentNativeElement: any;
  private svgContainer: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;

  private simulation: any; // TODO typings

  private nodes: any; // TODO typings
  private links: any; // TODO typings
  private labels: any; // TODO typings

  private nodeSizeScale: any; // TODO typings
  private labelSizeScale: any; // TODO typings
  private linkSizeScale: any; // TODO typings

  private nodeColorScale: any; // TODO typings
  private linkColorScale: any; // TODO typings

  private linkTransparencyScale: any; // TODO typings
  private nodeTransparencyScale: any; // TODO typings
  private strokeTransparencyScale: any; // TODO typings



  private radius = 15; // default radius

  private tooltipDiv: any;

  private nodesData = [];
  private linksData = [];

  constructor(element: ElementRef, private dataService: ForceNetworkDataService) {
    // to get native parent element of this component
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    if (this.nodeSizeField && this.linkSizeField && this.nodeColorField) {
      this.setScales();
      this.initVisualization();
    }
    this.dataService.nodes.subscribe((data) => {
      this.nodesData = this.nodesData.filter((e: Node) => !data.remove
        .some((obj: Datum<Node>) => obj[idSymbol] === e.id)).concat(data.insert.toArray());

      data.update.forEach((el) => {
        const index = this.nodesData.findIndex((e) => e.id === el[1].id);
        this.nodesData[index] = Object.assign(this.nodesData[index] || {}, <Node>el[1]);
      });
      if (this.nodesData.length) {
        this.setScales();
        this.drawPlots();
      }
    });

    this.dataService.links.subscribe((data) => {
      this.linksData = this.linksData.filter((e: Node) => !data.remove
        .some((obj: Datum<Link>) => obj[idSymbol] === e.id)).concat(data.insert.toArray());

      data.update.forEach((el) => {
        const index = this.linksData.findIndex((e) => e.id === el[1].id);
        this.linksData[index] = Object.assign(this.linksData[index] || {}, <Link>el[1]);
      });

      if (this.linksData.length) {
        this.setScales();
        this.drawPlots();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('nodeStream' in changes && this.nodeStream) {
      this.nodesData = [];
      this.linksData = [];
      this.updateStreamProcessor(false);
    } else if (Object.keys(changes).filter((k) => k.endsWith('Field')).length) {
      this.updateStreamProcessor();
    }

    if (!this.autoresize && ('width' in changes || 'height' in changes)) {
      this.resize(this.width, this.height);
    }

    if ('runSimulation' in changes && this.simulation) {
      if (this.runSimulation) {
        this.simulation.start();
      } else {
        this.simulation.stop();
      }
    }
  }

  resize(width: number, height: number): void {
    this.elementWidth = width;
    this.elementHeight = height;

    if (this.svgContainer) {
      this.svgContainer.remove();
    }

    this.setScales();
    this.initVisualization();
    this.drawPlots();
  }

  onResize({width, height}: {width: number, height: number}): void {
    if (this.autoresize) {
      this.resize(width, height);
    }
  }

  updateStreamProcessor(update = true) {
    if (update) {
      this.dataService.updateData();
    }
    if (!update) {
      this.dataService.fetchData(
        this.nodeStream,
        this.linkStream,

        this.nodeIdField,
        this.nodeSizeField,
        this.nodeColorField,
        this.nodeLabelField,
        this.nodeFixedXField,
        this.nodeFixedYField,

        this.linkIdField,
        this.linkSourceField,
        this.linkTargetField,
        this.linkSizeField,

        this.tooltipTextField,
        this.nodeTransparencyField,
        this.linkTransparencyField,
        this.strokeTransparencyField
      );
    }
  }

  setScales() {
    this.nodeSizeScale = scaleLinear()
      .domain([
        d3Array.min(this.nodesData, (d) => Number(d.size)),
        d3Array.max(this.nodesData, (d) => Number(d.size))
      ])
      .range(this.nodeSizeRange);

    this.labelSizeScale = scaleLinear()
      .domain([
        d3Array.min(this.nodesData, (d) => Number(d[this.labelSizeField])),
        d3Array.max(this.nodesData, (d) => Number(d[this.labelSizeField]))
      ])
      .range(this.labelSizeRange);

    this.nodeColorScale = scaleLinear<string>()
      .domain([
        d3Array.min(this.nodesData, (d) => d.color),
        d3Array.max(this.nodesData, (d) => d.color)
      ])
      .range(this.nodeColorRange);

    this.linkSizeScale = scaleLinear()
      .domain([
        d3Array.min(this.linksData, (d) => d.size),
        d3Array.max(this.linksData, (d) => d.size)
      ])
      .range(this.linkSizeRange);

    this.linkColorScale = scaleLinear<string>()
      .domain([
        d3Array.min(this.linksData, (d) => Number(d[this.linkColorField])),
        d3Array.max(this.linksData, (d) => Number(d[this.linkColorField])) / 2,
        d3Array.max(this.linksData, (d) => Number(d[this.linkColorField]))
      ])
    .range(this.linkColorRange);

    this.linkTransparencyScale = scaleLinear()
      .domain([
        d3Array.min(this.linksData,
          (d) => Number(d.linkTransparencyField) === undefined ? 1 : Number(d.linkTransparencyField)),
        d3Array.max(this.linksData,
          (d) => Number(d.linkTransparencyField) === undefined ? 1 : Number(d.linkTransparencyField))
        ])
      .range(this.linkTransparencyRange.reverse());

    this.strokeTransparencyScale = scaleLinear()
    .domain([
      d3Array.min(this.nodesData,
        (d) => Number(d.strokeTransparency) === undefined ? 1 : Number(d.strokeTransparency)),
      d3Array.max(this.nodesData,
        (d) => Number(d.strokeTransparency) === undefined ? 1 : Number(d.strokeTransparency))
      ])
    .range(this.strokeTransparencyRange.reverse());

      this.nodeTransparencyScale = scaleLinear()
      .domain([
        d3Array.min(this.nodesData,
          (d) => Number(d.nodeTransparency) === undefined ? 1 : Number(d.nodeTransparency)),
        d3Array.max(this.nodesData,
          (d) => Number(d.nodeTransparency) === undefined ? 1 : Number(d.nodeTransparency))
        ])
      .range(this.nodeTransparencyRange.reverse());
  }

  initVisualization() {
    const container = d3Selection.select(this.parentNativeElement)
      .select('.forceNetworkContainer');

    this.svgContainer = container.append('svg')
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('width', this.elementWidth)
      .attr('height', this.elementHeight)
      .classed('svg-content-responsive', true)
      .attr('class', 'container');

    this.simulation = d3Force.forceSimulation<any>(this.nodesData)
      .force('link', d3Force.forceLink().distance(this.linkDistance)
        .id(link => link[idSymbol]))
      .force('charge', d3Force.forceManyBody().strength(this.chargeStrength))
      .force('center', d3Force.forceCenter(this.elementWidth / 2.2, this.elementHeight / 2))
      .force('x', d3Force.forceX(this.elementWidth / 2.2).strength(.7))
      .force('y', d3Force.forceY(this.elementHeight / 2).strength(.7))
      .on('tick', () => this.ticked());

    this.simulation.velocityDecay(0.4);
    this.simulation.alpha(0.9);

    const g = this.svgContainer.append('g');
    this.links = g.append('g').attr('stroke', '#000').attr('stroke-width', 1.5).selectAll('.link');
    this.nodes = g.append('g').attr('stroke', '#000').selectAll('.node');

    this.tooltipDiv = container.select('.tooltip');
  }

  drawPlots() {
    this.nodes = this.nodes.data(this.nodesData, (d) => d[idSymbol]);
    this.nodes.transition().attr('r', (d) => this.nodeSizeScale(d.size))
      .attr('fill', (d) => this.nodeColorScale(d.color))
      .attr('opacity', (d) => this.nodeTransparencyScale(d.nodeTransparency))
      .attr('stroke-opacity', (d) => this.strokeTransparencyScale(d.strokeTransparency));

    this.nodes.exit().remove();
    this.nodes = this.nodes.enter().append('circle')
      .attr('fill', (d) => this.nodeColorScale(d.color))
      .attr('opacity', (d) => this.nodeTransparencyScale(d.nodeTransparency))
      .attr('r', (d) => this.nodeSizeScale(d.size)).merge(this.nodes)
      .attr('stroke-opacity', (d) => this.strokeTransparencyScale(d.strokeTransparency))
      .call(d3Drag.drag()
      .on('start', this.dragstarted.bind(this))
      .on('drag', this.dragged.bind(this))
      .on('end', this.dragended.bind(this)));

    this.nodes.on('mouseover', (d) => this.onMouseOver(d[idSymbol]));
    this.nodes.on('mouseout', (d) => this.onMouseOut(d[idSymbol]));

    this.links = this.links.data(this.linksData, (d) => d.id);

    this.links.transition().attr('stroke-width', (d) => this.linkSizeScale(d.size))
      .attr('stroke', (d) => this.linkColorScale(
        d[this.linkColorField]) === undefined ? 'black' : this.linkColorScale(d[this.linkColorField]))
      .attr('opacity', (d) => isNaN(this.linkTransparencyScale(d.linkTransparency)) ? 1 : this.linkTransparencyScale(d.linkTransparency));

    this.links.exit().remove();
    this.links = this.links.enter().append('line').merge(this.links)
      .attr('stroke-width', (d) => isNaN(this.linkSizeScale(d.size)) ? 1 : this.linkSizeScale(d.size))
      .attr('stroke', (d) => this.linkColorScale(
        d[this.linkColorField]) === undefined ? 'black' : this.linkColorScale(d[this.linkColorField]))
      .attr('opacity', (d) => isNaN(this.linkTransparencyScale(d.linkTransparencyField)) ?
                                  1 :
                                  this.linkTransparencyScale(d.linkTransparencyField));


    this.labels = this.svgContainer.selectAll('text').data(this.nodesData, (d) => d[idSymbol]);
    this.labels.transition()
      .style('font-size', (d) => isNaN(this.labelSizeScale(d[this.labelSizeField])) ? 16 : this.labelSizeScale(d[this.labelSizeField]))
      .attr('dx', 15) // label position encoding is not supported yet
      .attr('dy', 10);
    this.labels.exit().remove();
    this.labels = this.labels.enter().append('text')
      .text((d) => d[idSymbol])
      .style('font-size', (d) => isNaN(this.labelSizeScale(d[this.labelSizeField])) ? 16 : this.labelSizeScale(d[this.labelSizeField]))
      .attr('dx', 15) // label position encoding is not supported yet
      .attr('dy', 10);

    this.simulation.nodes(this.nodesData);

    const validLinks = this.linksData.filter((link) => this.nodesData.findIndex((node) => node[idSymbol] === link[idSymbol]) > -1);
    this.simulation.force('link').links(validLinks);

    this.simulation.alpha(1).restart();
  }

  ticked() {
    this.nodes.attr('cx', (d) => d.x = Math.max(this.radius, Math.min(this.elementWidth - this.radius, d.x)))
      .attr('cy', (d) => d.y = Math.max(this.radius, Math.min(this.elementHeight - this.radius, d.y)));

    this.svgContainer.selectAll('text').attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y);

    this.links.attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    if (!this.runSimulation) {
      this.simulation.stop();
    }
  }

  onMouseOver(targetID: any) {
    let tooltipText = '';
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: any) => {
        if (d[idSymbol] === targetID) {
          tooltipText = d.tooltipText.toString();
          return true;
        }
      });

    selection.transition().attr('r', (d: any) => 2 * this.nodeSizeScale(d.size));

    const textSelection = this.svgContainer.selectAll('text')
      .filter((d: any) => d.id === targetID);

    textSelection.transition().style('font-size', (d) => isNaN(
      this.labelSizeScale(d[this.labelSizeField])) ? '32px' : 2 * this.labelSizeScale(d[this.labelSizeField]))
      .attr('dx', 30)
      .attr('dy', 20);

    if (this.enableTooltip) {
      this.tooltipDiv.transition().style('opacity', .7)
        .style('visibility', 'visible');

      this.tooltipDiv.html(tooltipText)
        .style('left', d3Selection.event.x - 50 + 'px')
        .style('top',  d3Selection.event.y - 40 + 'px');
    }
  }

  onMouseOut(targetID: any) {
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: any) => d[idSymbol] === targetID);

    selection.transition().attr('r', (d: any) => this.nodeSizeScale(d.size));


    const textSelection = this.svgContainer.selectAll('text')
      .filter((d: any) => d.id === targetID);

    textSelection.transition().style('font-size', (d) => isNaN(
      this.labelSizeScale(d[this.labelSizeField])) ? '16px' : this.labelSizeScale(d[this.labelSizeField]))
    .attr('dx', 15)
    .attr('dy', 10);

    if (this.enableTooltip) {
      this.tooltipDiv.style('opacity', 0)
      .style('visibility', 'hidden');
    }
  }

  dragstarted(d) {
    if (!d3Selection.event.active) {
      this.simulation.alphaTarget(0.3)
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

}
