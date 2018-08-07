import { Directive, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Cancelable, defaultTo, throttle } from 'lodash';

/**
 * Directive for listening to the window resize event.
 */
@Directive({
  selector: '[dinoResizable]'
})
export class ResizableDirective implements OnChanges {
  /**
   * Default throttle wait time used if a wait time is not specified or invalid.
   */
  static defaultThrottleWait = 100;
  private throttledCallback?: (() => void) & Cancelable;
  private pending = false;

  /**
   * Specifies the callback for resize events.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('dinoResizable') callback: () => void;
  /**
   * Specifies the throttle wait time before invoking the callback.
   */
  @Input() resizeThrottleWait = ResizableDirective.defaultThrottleWait;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('callback' in changes || 'resizeThrottleWait' in changes) {
      if (this.throttledCallback && this.pending) {
        // Flush any pending callback
        this.throttledCallback.flush();
      }

      this.throttledCallback = undefined;
      if (this.callback) {
        const callback = this.callback;
        const wait = defaultTo(+this.resizeThrottleWait, ResizableDirective.defaultThrottleWait);
        this.throttledCallback = throttle(() => {
          this.pending = false;
          callback();
        }, wait);
      }
    }
  }

  /**
   * Listen to the window's resize event and invoke the callback.
   *
   */
  @HostListener('window:resize')
  onResize(): void {
    if (this.throttledCallback) {
      this.pending = true;
      this.throttledCallback();
    }
  }
}
