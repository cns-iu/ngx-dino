import {
  Component,
  OnInit,
  ElementRef,
  Input,
  OnChanges
} from '@angular/core';


@Component({
  selector: 'dino-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.sass']
})
export class ScienceMapComponent implements OnInit, OnChanges {
  
  private parentNativeElement: any;

  constructor(element: ElementRef) { 
    this.parentNativeElement = element.nativeElement; // to get native parent element of this component
  }

  ngOnInit() { 
    this.initVisualization();
  }

  ngOnChanges() { }

  initVisualization() { }

}