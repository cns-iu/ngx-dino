import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isFunction } from 'lodash';
import { path } from 'd3-path';
import { Point, isPoint } from '../shared/utility';
import { BuiltinLinkTypes, LinkType } from '../shared/options';

@Component({
  selector: 'dino-edge',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.css']
})
export class EdgeComponent implements OnChanges {
  @Input() link: BuiltinLinkTypes | LinkType;
  @Input() source: Point;
  @Input() target: Point;

  path: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('link' in changes || 'source' in changes || 'target' in changes) {
      if (this.isValid()) {
        this.updatePath();
      }
    }
    // TODO
  }

  isValid(): boolean {
    const {source, target} = this;
    return (
      isPoint(source) && isPoint(target) &&
      this.getLink() !== undefined
    );
  }

  private getLink(): LinkType {
    const link = this.link;
    if (isFunction(link['draw'])) {
      return link as LinkType;
    }
    // FIXME
    // Assume `line` for now
    return {
      draw(context: CanvasPathMethods, source: Point, target: Point): void {
        context.moveTo(...source);
        context.lineTo(...target);
      }
    };
  }

  private updatePath(): void {
    const {source, target} = this;
    const context = path();

    this.getLink().draw(context as any, source, target);
    this.path = context.toString();
  }
}
