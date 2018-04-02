import {
  Component,
  OnInit,
  ElementRef,
  Input,
  OnChanges
} from '@angular/core';
import { Changes, StreamCache, BoundField } from '@ngx-dino/core';

import * as d3Selection from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import * as d3Array from 'd3-array';
import 'd3-transition'; 

import { ScienceMapDataService } from '../shared/science-map-data.service';
import * as underlyingScimapData from '../shared/underlyingScimapData.json';

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

  private parentNativeElement: any;
  private svgContainer: d3Selection.Selection<d3Selection.BaseType, any, HTMLElement, undefined>;
  private nodes: any;
  private defaultNodeSize = 4;
  private defaultNodeSizeRange = [10, 20];
  private labels: any;
  private links: any;
  private translateXScale: any;
  private translateYScale: any;
  private nodeSizeScale: any;
  private nestedData: any;

  constructor(element: ElementRef, public dataService: ScienceMapDataService) { 
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() { 
    this.calculateTableData();  
    this.setScales();
    this.initVisualization();

    this.createNodes();
    this.createEdges();
    this.createLabels('black', 16);
    this.createLabels(' ', 16);
  } 

  ngOnChanges() { }

  setScales() {
    this.translateXScale = scaleLinear()
      .domain(d3Array.extent(underlyingScimapData.nodes, (d: any) => <number>d.x))
      .range([10, this.width - 10]);
      
    this.translateYScale = scaleLinear()
      .domain(d3Array.extent(underlyingScimapData.nodes, (d: any) => <number>d.y))
      .range([this.height - 10, 10]);

    this.nodeSizeScale = scaleLinear()
      .domain(d3Array.extent(this.dataService.nestedData.sub_disc, (d: any) => {
        let match = underlyingScimapData.nodes.find((d1) => {
          if (d1.subd_id.toString() === d.key.toString())
            return d1;
        });
        return <number>match.tableData.length;
      }))
      .range(this.defaultNodeSizeRange);
  }

  initVisualization() { 
    // initializing svg container
    let container = d3Selection.select(this.parentNativeElement)
      .select('#scienceMapContainer');

    this.svgContainer = container.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('background', 'white')
      .attr('class', 'container');
  }

  createNodes() {
    this.nodes = this.svgContainer.selectAll('.underlyingNodes')
      .data<any>(underlyingScimapData.nodes);
    
    this.nodes.enter().append('g')
      .attr('class', (d) => 'wvf-node-g subd_id' + d.subd_id + ' disc_id' + d.disc_id)
      .attr('transform', (d) => 'translate(' + this.translateXScale(d.x) + ',' + this.translateYScale(d.y) + ')')
      .append('circle')
      .attr('r', (d) => this.nodeSizeScale(this.subdisciplineSizeField.get(d)) || this.defaultNodeSize)
      .attr('class', (d) => {
        return 'wvf-node subd_id' + d.subd_id + ' disc_id' + d.disc_id;
      })
      .attr('fill', (d) => {
        let disc = underlyingScimapData.disciplines.filter((d1) => {
            if (d.disc_id === d1.disc_id) {
                return d1;
            }
        })
        return disc[0].color;
      }
    )
      .attr('x', (d) => this.translateXScale(d.x))
      .attr('y', (d) =>  this.translateYScale(d.y))
      .attr('stroke', 'black')
      .on('mouseover', (d) => this.onMouseOver(d))
      .on('mouseout', (d) => this.onMouseOut(d));
     
      this.svgContainer.append('g').attr('class', 'labels')
      .selectAll('text').data<any>(underlyingScimapData.nodes).enter()
      .append('text')
      .attr('class', 'subd subd_label')
      .text((d) =>  d.subd_name)
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
      .data<any>(underlyingScimapData.labels).enter()
      .append('text')
      .attr('class', 'wvf-label')
      .attr('text-anchor', (d) => {
        let x = this.translateXScale(d['x']);
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
      .data<any>(underlyingScimapData.edges)
      .enter().append('line')
      .attr('class', (d1) => 'wvf-edge s' + d1.subd_id1 + ' t' + d1.subd_id2)
      .attr('stroke', '#9b9b9b')
      .attr('stroke-width', '1px')
      .attr('opacity', 0.5)
      .attr('x1', (d) => {
        const node = this.svgContainer.selectAll('circle').nodes().filter((d2: any) => d2.classList.contains('subd_id'+ d.subd_id1));
        return this.translateXScale(node[0]['__data__'].x);
      })
      .attr('y1', (d) => {
        const node = this.svgContainer.selectAll('circle').nodes().filter((d2: any) => d2.classList.contains('subd_id'+ d.subd_id1));
        return this.translateYScale(node[0]['__data__'].y);
      })
      .attr('x2', (d) => {
        const node = this.svgContainer.selectAll('circle').nodes().filter((d2: any) => d2.classList.contains('subd_id'+ d.subd_id2));
        return this.translateXScale(node[0]['__data__'].x);
      })
      .attr('y2', (d) => {
        const node = this.svgContainer.selectAll('circle').nodes().filter((d2: any) => d2.classList.contains('subd_id'+ d.subd_id2));
        return this.translateYScale(node[0]['__data__'].y);
      });
  }

  onMouseOver(target: any) {
    const selection = this.svgContainer.selectAll('circle')
    .filter((d: any) => d.subd_id === target.subd_id);
    selection.transition().attr('r', (d) => 2 * this.nodeSizeScale(this.subdisciplineSizeField.get(d)));
    
    const textSelection = this.svgContainer.selectAll('.subd_label')
    .filter((d: any) => d.subd_id === target.subd_id);
    textSelection.transition().attr('display', 'block');
  }

  onMouseOut(target: any) {
    const selection = this.svgContainer.selectAll('circle')
      .filter((d: any) => d.subd_id === target.subd_id);
    selection.transition().attr('r', (d) => this.nodeSizeScale(this.subdisciplineSizeField.get(d)) || this.defaultNodeSize);  

    const textSelection = this.svgContainer.selectAll('.subd_label')
    .filter((d: any) => d.subd_id === target.subd_id);
    textSelection.transition().attr('display', 'none');
  }

  calculateTableData() {
    underlyingScimapData.nodes.forEach((d) => {
      d.tableData = [];
  
      let match = this.dataService.nestedData.sub_disc.find((d1) => {
        if (d.subd_id.toString() === d1.key.toString()) {
          return d1;
        }
      });
      if (match) {
        match.value.children.forEach((d1) => {
          let matches = d.tableData.filter((d2) => {
            if (d1.journal.toString() === d2.journal.toString() && d1.title.toString() === d2.title.toString()) {
              return d2;
            }
          })
          if (matches.length === 0) {
            if (d1.url!= null){
              d.tableData.push({
                authors: d1.author_list,
                year: d1.year,
                title: d1.title,
                url: d1.url,
                journal: d1.journal,
                class:'enabled'
              })
            }
            else{
              d.tableData.push({
                authors: d1.author_list,
                year: d1.year,
                title: d1.title,
                url: '#',
                journal: d1.journal,
                class: 'disabled'
              })
            }
          }
        })
      }
    });
  
  }

}