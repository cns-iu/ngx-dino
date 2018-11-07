import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { path } from 'd3-path';
import { isFunction, isNil } from 'lodash';

import { BuiltinEdgeTypes, EdgeType } from '../shared/options';
import { Point, isPoint, setDefaultValue } from '../shared/utility';

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
  @Input() stroke = 'black';
  @Input() transparency = 1;
  @Input() strokeWidth = 0;
  @Input() strokeTransparency = 1;

  path: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // Set (reset) default values
    setDefaultValue(this, changes, 'edge', 'line');
    setDefaultValue(this, changes, 'stroke', 'black');
    setDefaultValue(this, changes, 'transparency', 1);
    setDefaultValue(this, changes, 'strokeWidth', 0);
    setDefaultValue(this, changes, 'strokeTransparency', 1);

    if ('edge' in changes || 'source' in changes || 'target' in changes) {
      if (this.isValid()) {
        this.updatePath();
      }
    }
  }

  isValid(): boolean {
    const {source, target} = this;
    return isPoint(source) && isPoint(target);
  }

  private getEdge(): EdgeType {
    const edge = this.edge;
    if (edge && isFunction(edge['draw'])) {
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
