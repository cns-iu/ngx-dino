import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { isFunction } from 'lodash';
import { path } from 'd3-path';
import { Point, isPoint } from '../shared/utility';
import { BuiltinEdgeTypes, EdgeType } from '../shared/options';

@Component({
  selector: '[dino-network-edge]', // tslint:disable-line:component-selector
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EdgeComponent implements OnChanges {
  @Input() edge: BuiltinEdgeTypes | EdgeType = 'line';
  @Input() source: Point;
  @Input() target: Point;
  @Input() stroke: string;
  @Input() transparency: number;
  @Input() strokeWidth: number;
  @Input() strokeTransparency: number;

  path: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('edge' in changes || 'source' in changes || 'target' in changes) {
      if (this.isValid()) {
        this.updatePath();
      }
    }
  }

  isValid(): boolean {
    const {source, target} = this;
    return (
      isPoint(source) && isPoint(target) &&
      this.getEdge() !== undefined
    );
  }

  private getEdge(): EdgeType {
    const edge = this.edge;
    if (isFunction(edge['draw'])) {
      return edge as EdgeType;
    }
    // FIXME
    // Assume `line` for now
    return {
      draw(context: CanvasRenderingContext2D, source: Point, target: Point): void {
        context.moveTo(source[0], source[1]);
        context.lineTo(target[0], target[1]);
      }
    };
  }

  private updatePath(): void {
    const {source, target} = this;
    const context = path();

    this.getEdge().draw(context as any, source, target);
    this.path = context.toString();
  }
}
