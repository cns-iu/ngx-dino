import { ElementRef, Inject, Injectable, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ResizeSensor, ResizeSensorConstructor } from './sensors/sensor';
import { NullResizeSensor } from './sensors/null-sensor';
import { ObserverResizeSensor } from './sensors/observer-sensor';
import { GenericResizeSensor } from './sensors/generic-sensor';

@Injectable({
  providedIn: 'root'
})
export class ResizeSensorService {
  private readonly sensorType: ResizeSensorConstructor;

  constructor(@Inject(PLATFORM_ID) platformId: string) {
    const isBrowser = isPlatformBrowser(platformId);
    const hasResizeObserver = typeof ResizeObserver !== 'undefined';
    if (!isBrowser) {
      this.sensorType = NullResizeSensor;
    } else if (hasResizeObserver) {
      this.sensorType = ObserverResizeSensor;
    } else {
      this.sensorType = GenericResizeSensor;
    }
  }

  createSensor(element: ElementRef, renderer: Renderer2): ResizeSensor {
    return new this.sensorType(element, renderer);
  }
}
