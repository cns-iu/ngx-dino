import { ElementRef, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';

export interface ResizeEvent {
  width: number;
  height: number;
}

export interface ResizeSensorConstructor {
  new (element: ElementRef, renderer: Renderer2): ResizeSensor;
}

export interface ResizeSensor {
  readonly onResize: Observable<ResizeEvent>;
  destroy(): void;
  reset?(): void;
}
