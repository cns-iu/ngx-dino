import {
  Directive, HostListener, Input, Output,
  OnChanges, SimpleChanges, SimpleChange,
  ElementRef, EventEmitter
} from '@angular/core';
import {
  Cancelable, ThrottleSettings,
  isUndefined,
  defaults, throttle
} from 'lodash';


export type ResizeThrottleSettings = ThrottleSettings & {wait?: number};
export interface ResizeEvent {
  width: SimpleChange;
  height: SimpleChange;
}

/**
 * Directive for receiving resize events with the new width and height.
 */
@Directive({
  selector: '[dinoResizable]'
})
export class ResizableDirective implements OnChanges {
  /**
   * Settings for controlling the throttling of resize events.
   */
  @Input() resizeThrottleSettings?: ResizeThrottleSettings;
  /**
   * Output emitting events with the width and height changes.
   */
  @Output() resized = new EventEmitter<ResizeEvent>(true);

  private callback: (() => void) & Cancelable = this.createCallback();
  private pending = false;
  private previousWidth?: number;
  private previousHeight?: number;

  constructor(private element: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('resizeThrottleSettings' in changes) {
      if (this.pending) {
        this.callback.flush();
      }
      this.callback = this.createCallback();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.pending = true;
    this.callback();
  }

  private onResizeCallback(): void {
    const {element: {nativeElement}, previousWidth, previousHeight} = this;
    const {width, height} = (nativeElement as Element).getBoundingClientRect();
    const widthChange = new SimpleChange(previousWidth, width, isUndefined(previousWidth));
    const heightChange = new SimpleChange(previousHeight, height, isUndefined(previousHeight));
    const event: ResizeEvent = {width: widthChange, height: heightChange};

    this.pending = false;
    this.previousWidth = width;
    this.previousHeight = height;

    this.resized.emit(event);
  }

  private createCallback(): (() => void) & Cancelable {
    const settings = defaults({}, this.resizeThrottleSettings, {
      wait: 100,
      leading: true,
      trailing: true
    });

    return throttle(this.onResizeCallback.bind(this), settings.wait, settings);
  }
}
