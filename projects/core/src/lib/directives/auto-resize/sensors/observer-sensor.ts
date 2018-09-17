import { ElementRef, EventEmitter } from '@angular/core';
import { ResizeEvent, ResizeSensor } from './sensor';

declare global {
  var ResizeObserver;
}

// Do not use if ResizeObserver is undefined. This class does not check it.
export class ObserverResizeSensor implements ResizeSensor {
  readonly onResize = new EventEmitter<ResizeEvent>();
  private observer = new ResizeObserver(this.onResizeImpl.bind(this));

  constructor(element: ElementRef) {
    this.observer.observe(element.nativeElement);
  }

  destroy(): void {
    this.observer.disconnect();
  }

  private onResizeImpl(entries: any[]): void {
    // There should only be a single entry
    const entry = entries[0];
    const { width, height }: { width: number, height: number } = entry.contentRect;
    this.onResize.emit({ width, height });
  }
}
