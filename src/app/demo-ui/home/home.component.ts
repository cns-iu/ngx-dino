import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AutoResizeResetEvent } from '@ngx-dino/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  @ViewChild('tabs', { static: true }) tabs: any;

  openState = true;
  tabIndex = 0;

  narrowWidth = window.innerWidth - 360;
  wideWidth = window.innerWidth;
  height = window.innerHeight - 130;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.activate(0);
    this.tabs.selectedIndexChange.subscribe((index) => {
      this.tabIndex = index;
      this.activate(index);
    });
  }

  private activate(index: number): void {
    const target = this.element.nativeElement as EventTarget;
    if (target.dispatchEvent) {
      target.dispatchEvent(new AutoResizeResetEvent());
    }
  }
}
