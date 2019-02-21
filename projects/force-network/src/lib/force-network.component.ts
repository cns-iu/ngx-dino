import 'd3-transition';

import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BoundField, ChangeSet, Datum, idSymbol, RawChangeSet } from '@ngx-dino/core';
import * as d3Array from 'd3-array';
import * as d3Drag from 'd3-drag';
import * as d3Force from 'd3-force';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import * as d3Selection from 'd3-selection';
import { Observable } from 'rxjs';

import { ForceNetworkDataService } from './shared/force-network-data.service';
import { Link, Node } from './shared/network';

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

  @Input() linkSizeRange = [1, 8];
  @Input() linkColorRange = ['#FFFFFF', '#3182BD'];

  @Input() minPositionX = 0;
  @Input() minPositionY = -20;

  @Input() chargeStrength = -10;
  @Input() linkDistance = 105;

  private elementWidth = 0;
  private elementHeight = 0;

  private parentNativeElement: HTMLElement;
  private svgContainer: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;

  private simulation: any; // TODO typings

  private nodes: d3Selection.Selection<SVGCircleElement, any, SVGElement, any>; // TODO typings
  private links: any; // TODO typings
  private labels: any; // TODO typings

  private nodeSizeScale: ScaleLinear<number, number>;
  private labelSizeScale: ScaleLinear<number, number>;
  private linkSizeScale: ScaleLinear<number, number>;

  private nodeColorScale: ScaleLinear<string, string>;
  private linkColorScale: ScaleLinear<string, string>;

  private transparencyScale: ScaleLinear<number, number>;

  private radius = 15; // default radius

  private tooltipDiv: d3Selection.Selection<HTMLElement, {}, HTMLElement, any>;

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
    this.dataService.nodes.subscribe((data: ChangeSet<Node>) => {
      this.nodesData = this.nodesData.filter((e: Node) => !data.remove
        .some((obj: Datum<Node>) => obj[idSymbol] === e.id)).concat(data.insert.toArray());
      data.update.forEach((el: Datum<Partial<Node>>) => {
        const index = this.nodesData.findIndex((e: Node) => e.id === el[1].id);
        this.nodesData[index] = Object.assign(this.nodesData[index] || {}, <Node>el[1]);
      });
      if (this.nodesData.length) {
        this.setScales();
        this.drawPlots();
      }
    });

    this.dataService.links.subscribe((data: ChangeSet<Link>) => {
      this.linksData = this.linksData.filter((e: Node) => !data.remove
        .some((obj: Datum<Link>) => obj[idSymbol] === e.id)).concat(data.insert.toArray());

      data.update.forEach((el: Datum<Partial<Link>>) => {
        const index = this.linksData.findIndex((e: Link) => e.id === el[1].id);
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
    } else if (Object.keys(changes).filter((k: string) => k.endsWith('Field')).length) {
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

  onResize({ width, height }: { width: number, height: number }): void {
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
        d3Array.min(this.nodesData, (d: Node) => Number(d.size)),
        d3Array.max(this.nodesData, (d: Node) => Number(d.size))
      ])
      .range(this.nodeSizeRange);

    this.labelSizeScale = scaleLinear()
      .domain([
        d3Array.min(this.nodesData, (d: Node) => Number(d[this.labelSizeField])),
        d3Array.max(this.nodesData, (d: Node) => Number(d[this.labelSizeField]))
      ])
      .range(this.labelSizeRange);

    this.nodeColorScale = scaleLinear<string>()
      .domain([
        d3Array.min(this.nodesData, (d: Node) => d.color),
        d3Array.max(this.nodesData, (d: Node) => d.color)
      ])
      .range(this.nodeColorRange);

    this.linkSizeScale = scaleLinear()
      .domain([
        d3Array.min(this.linksData, (d: Link) => d.size),
        d3Array.max(this.linksData, (d: Link) => d.size)
      ])
      .range(this.linkSizeRange);

    this.linkColorScale = scaleLinear<string>()
      .domain([
        d3Array.min(this.linksData, (d: Link) => Number(d[this.linkColorField])),
        d3Array.max(this.linksData, (d: Link) => Number(d[this.linkColorField])) / 2,
        d3Array.max(this.linksData, (d: Link) => Number(d[this.linkColorField]))
      ])
      .range(this.linkColorRange);

    this.transparencyScale = scaleLinear()
      .domain([0, 1])
      .range([1, 0]);
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
    this.nodes = this.nodes.data(this.nodesData, (d: Node) => d[idSymbol]);
    this.nodes.transition().attr('r', (d: Node) => this.nodeSizeScale(d.size))
      .attr('fill', (d: Node) => this.nodeColorScale(d.color))
      .attr('opacity', (d: Node) => this.transparencyScale(d.nodeTransparency))
      .attr('stroke-opacity', (d: Node) => this.transparencyScale(d.strokeTransparency));

    this.nodes.exit().remove();
    this.nodes = this.nodes.enter().append('circle')
      .attr('fill', (d: Node) => this.nodeColorScale(d.color))
      .attr('opacity', (d: Node) => this.transparencyScale(d.nodeTransparency))
      .attr('r', (d: Node) => this.nodeSizeScale(d.size)).merge(this.nodes)
      .attr('stroke-opacity', (d: Node) => this.transparencyScale(d.strokeTransparency))
      .call(d3Drag.drag()
        .on('start', this.dragstarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragended.bind(this)));

    this.nodes.on('mouseover', (d: Node) => this.onMouseOver(d[idSymbol]));
    this.nodes.on('mouseout', (d: Node) => this.onMouseOut(d[idSymbol]));

    this.links = this.links.data(this.linksData, (d: Link) => d.id);

    this.links.transition()
      .attr('stroke-width', (d: Link) => this.linkSizeScale(d.size))
      .attr('stroke', (d: Link) => this.linkColorScale(
        d[this.linkColorField]) === undefined ? 'black' : this.linkColorScale(d[this.linkColorField]))
      .attr('opacity', (d: Link) => isNaN(this.transparencyScale(d.linkTransparency)) ? 1 : this.transparencyScale(d.linkTransparency));
    this.links.exit().remove();
    this.links = this.links.enter().append('line').merge(this.links)
      .attr('stroke-width', (d: Link) => isNaN(this.linkSizeScale(d.size)) ? 1 : this.linkSizeScale(d.size))
      .attr('stroke', (d: Link) => this.linkColorScale(
        d[this.linkColorField]) === undefined ? 'black' : this.linkColorScale(d[this.linkColorField]))
      .attr('opacity', (d: Link) => isNaN(this.transparencyScale(d.linkTransparency)) ?
        1 : this.transparencyScale(d.linkTransparency));


    this.labels = this.svgContainer.selectAll('text').data(this.nodesData, (d: Node) => d[idSymbol]);
    this.labels.transition()
      .style('font-size', (d: Node) =>
      isNaN(this.labelSizeScale(d[this.labelSizeField])) ? 16 : this.labelSizeScale(d[this.labelSizeField]))
      .attr('dx', 15) // label position encoding is not supported yet
      .attr('dy', 10);
    this.labels.exit().remove();
    this.labels = this.labels.enter().append('text')
      .text((d: Node) => d[idSymbol])
      .style('font-size', (d: Node) =>
      isNaN(this.labelSizeScale(d[this.labelSizeField])) ? 16 : this.labelSizeScale(d[this.labelSizeField]))
      .attr('dx', 15) // label position encoding is not supported yet
      .attr('dy', 10);

    this.simulation.nodes(this.nodesData);

    const validLinks = this.linksData.filter((link) => this.nodesData.findIndex((node: Node) => node[idSymbol] === link[idSymbol]) > -1);
    this.simulation.force('link').links(validLinks);

    this.simulation.alpha(1).restart();
  }

  ticked() {
    this.nodes.attr('cx', (d: Node) => d.x = Math.max(this.radius, Math.min(this.elementWidth - this.radius, d.x)))
      .attr('cy', (d: Node) => d.y = Math.max(this.radius, Math.min(this.elementHeight - this.radius, d.y)));

    this.svgContainer.selectAll('text').attr('x', (d: Node) => d.x)
      .attr('y', (d: Node) => d.y);

    this.links.attr('x1', (d: Link) => d.source.x)
      .attr('y1', (d: Link) => d.source.y)
      .attr('x2', (d: Link) => d.target.x)
      .attr('y2', (d: Link) => d.target.y);

    if (!this.runSimulation) {
      this.simulation.stop();
    }
  }

  onMouseOver(targetID: any) {
    let tooltipText = '';
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: Link) => {
        if (d[idSymbol] === targetID) {
          tooltipText = d.tooltipText.toString();
          return true;
        }
      });

    if (this.enableTooltip) {
      this.tooltipDiv.transition().style('opacity', .7)
        .style('visibility', 'visible');

      this.tooltipDiv.html(tooltipText)
        .style('left', d3Selection.event.x - 50 + 'px')
        .style('top', d3Selection.event.y - 40 + 'px');
    }
  }

  onMouseOut(targetID: string | number) {
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: Node) => d[idSymbol] === targetID);

    selection.transition().attr('r', (d: Node) => this.nodeSizeScale(d.size));


    const textSelection = this.svgContainer.selectAll('text')
      .filter((d: Node) => d.id === targetID);

    textSelection.transition().style('font-size', (d: Node) => isNaN(
      this.labelSizeScale(d[this.labelSizeField])) ? '16px' : this.labelSizeScale(d[this.labelSizeField]))
      .attr('dx', 15)
      .attr('dy', 10);

    if (this.enableTooltip) {
      this.tooltipDiv.style('opacity', 0)
        .style('visibility', 'hidden');
    }
  }

  dragstarted(d: Node) {
    if (!d3Selection.event.active) {
      this.simulation.alphaTarget(0.3)
        .restart();
    }

    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d: Node) {
    d.fx = d3Selection.event.x;
    d.fy = d3Selection.event.y;
  }

  dragended(d: Node) {
    if (!d3Selection.event.active) {
      this.simulation.alphaTarget(0);
    }

    d.fx = null;
    d.fy = null;
  }

}
