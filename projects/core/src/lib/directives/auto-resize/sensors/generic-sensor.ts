import { ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { ResizeEvent, ResizeSensor } from './sensor';

const validPositions = ['absolute', 'relative', 'fixed'];

const style = `
  position: absolute;
  left: -10px;
  top: -10px;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: -1;
  visibility: hidden;
  max-width: 100%
`;

const subStyle = `
  position: absolute;
  left: 0;
  top: 0;
  transition: 0s;
`;

// Must be placed on elements that can have div children
// Based on https://github.com/marcj/css-element-queries
export class GenericResizeSensor implements ResizeSensor {
  readonly onResize = new EventEmitter<ResizeEvent>();
  private sensorElement: any;
  private expandSensorElement: any;
  private innerExpandSensorElement: any;
  private shrinkSensorElement: any;
  private innerShrinkSensorElement: any;

  private size: ResizeEvent;
  private lastWidth: number;
  private lastHeight: number;

  private dirty = false;
  private hiddenCheck = true;
  private resetId: any;
  private callbackId: any;

  constructor(private element: ElementRef, private renderer: Renderer2) {
    // Set element styles if necessary
    if (window) {
      const computedStyle = window.getComputedStyle(element.nativeElement);
      const position = computedStyle ? computedStyle.getPropertyValue('position') : undefined;
      if (validPositions.indexOf(position) < 0) {
        renderer.setStyle(element.nativeElement, 'position', 'relative');
      }
    }

    // Create top sensor element
    const sensorElement = this.sensorElement = renderer.createElement('div');
    renderer.setProperty(sensorElement, 'dir', 'ltr');
    renderer.addClass(sensorElement, 'dino-generic-resize-sensor');
    renderer.setAttribute(sensorElement, 'style', style);

    // Create sub sensor elements
    ([this.expandSensorElement, this.innerExpandSensorElement] = this.createSubSensor(
      renderer, sensorElement, 'expand'
    ));
    ([this.shrinkSensorElement, this.innerShrinkSensorElement] = this.createSubSensor(
      renderer, sensorElement, 'shrink', 'width: 200%; height: 200%;'
    ));

    // Append sensor
    renderer.appendChild(element.nativeElement, sensorElement);
    ({ width: this.lastWidth, height: this.lastHeight } = this.size = this.getSize());

    // Add events
    const { expandSensorElement, shrinkSensorElement } = this;
    const callback = this.onScrollImpl.bind(this);
    renderer.listen(expandSensorElement, 'scroll', callback);
    renderer.listen(shrinkSensorElement, 'scroll', callback);

    // Initial reset
    this.resetImpl();
  }

  destroy(): void {
    this.renderer.removeChild(this.element.nativeElement, this.sensorElement);
  }

  reset(): void {
    this.hiddenCheck = true;
    this.resetImpl();
  }

  private getSize(): ResizeEvent {
    const native = this.element.nativeElement;
    if (native.getBoundingClientRect) {
      const { width, height } = native.getBoundingClientRect();
      return { width: Math.round(width), height: Math.round(height) };
    } else {
      return { width: native.offsetWidth, height: native.offsetHeight };
    }
  }

  private createSubSensor(
    renderer: Renderer2, sensorElement: any,
    classSuffix: string, extraStyles: string = ''
  ): [any, any] {
    const subSensor = renderer.createElement('div');
    const innerSubSensor = renderer.createElement('div');

    renderer.addClass(subSensor, 'dino-generic-resize-sensor-' + classSuffix);
    renderer.setAttribute(subSensor, 'style', style);
    renderer.setAttribute(innerSubSensor, 'style', subStyle + ' ' + extraStyles);

    renderer.appendChild(subSensor, innerSubSensor);
    renderer.appendChild(sensorElement, subSensor);

    return [subSensor, innerSubSensor];
  }

  private resetSensors(): void {
    const {
      renderer,
      expandSensorElement, innerExpandSensorElement,
      shrinkSensorElement
    } = this;

    renderer.setStyle(innerExpandSensorElement, 'width', '100000px');
    renderer.setStyle(innerExpandSensorElement, 'height', '100000px');

    renderer.setProperty(expandSensorElement, 'scrollLeft', 100000);
    renderer.setProperty(expandSensorElement, 'scrollTop', 100000);

    renderer.setProperty(shrinkSensorElement, 'scrollLeft', 100000);
    renderer.setProperty(shrinkSensorElement, 'scrollTop', 100000);
  }

  resetImpl(): void {
    if (this.hiddenCheck) {
      const expandSensorElement = this.expandSensorElement;
      if (expandSensorElement.scrollLeft || expandSensorElement.scrollTop) {
        this.hiddenCheck = false;
      } else {
        this.resetSensors();
        if (!this.resetId) {
          this.resetId = requestAnimationFrame(() => {
            this.resetId = undefined;
            this.resetImpl();
          });
        }
      }
    }

    this.resetSensors();
  }

  private onResizeImpl(): void {
    this.callbackId = undefined;
    if (!this.dirty) {
      return;
    }

    ({ width: this.lastWidth, height: this.lastHeight } = this.size);
    this.onResize.emit(this.size);
  }

  private onScrollImpl(): void {
    const { width, height } = this.size = this.getSize();
    this.dirty = width !== this.lastWidth || height !== this.lastHeight;

    if (this.dirty && !this.callbackId) {
      this.callbackId = requestAnimationFrame(this.onResizeImpl.bind(this));
    }
    this.resetImpl();
  }
}
