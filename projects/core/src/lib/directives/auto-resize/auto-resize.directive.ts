import { Directive, ElementRef, HostListener, Output, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { ResizeEvent, ResizeSensor } from './sensors/sensor';
import { ResizeSensorService } from './resize-sensor.service';

@Directive({
  selector: '[dinoAutoResize]'
})
export class AutoResizeDirective {
  @Output('dinoAutoResize') resize: Observable<ResizeEvent>;
  private sensor: ResizeSensor;

  constructor(element: ElementRef, renderer: Renderer2, sensorService: ResizeSensorService) {
    this.sensor = sensorService.createSensor(element, renderer);
    this.resize = this.sensor.onResize;
  }

  @HostListener('document:auto-resize-reset')
  reset(): void {
    if (this.sensor.reset) {
      this.sensor.reset();
    }
  }
}
