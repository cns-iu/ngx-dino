import { Component, Input, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ZoomLevel } from '../shared/types';

@Component({
  selector: 'dino-zoom-selector',
  templateUrl: './zoom-selector.component.html',
  styleUrls: ['./zoom-selector.component.css']
})
export class ZoomSelectorComponent {
  @Input() zoomLevels: ZoomLevel[];
  @Input() selected: number;
  @Output() selectZoomLevel: Observable<number>;

  _selectZoomLevel = new Subject<number>();

  constructor() {
    this.selectZoomLevel = this._selectZoomLevel.asObservable();
  }

  isChecked(index: number): boolean {
    return index === this.selected;
  }
}
