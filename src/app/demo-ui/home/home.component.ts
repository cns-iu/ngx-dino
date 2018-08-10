import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  @ViewChild('tabs') tabs: any;
  @ViewChild('scienceMap') scienceMap: any;
  @ViewChild('forceNetwork') forceNetwork: any;
  @ViewChild('geomap') geomap: any;

  openState = true;
  tabIndex = 0;

  narrowWidth = window.innerWidth - 360;
  wideWidth = window.innerWidth;
  height = window.innerHeight - 130;

  constructor() { }

  ngOnInit() {
    this.tabs.selectedIndexChange.subscribe((index) => ((this.tabIndex = index), this.activate(index)));
  }

  private activate(index: number): void {
    const component = this.getComponentForIndex(index);
    if (component && typeof component.activate === 'function') {
      setTimeout(() => component.activate(), 0);
    }
  }

  private getComponentForIndex(index: number): any {
    switch (index) {
      case 0:
        return this.scienceMap;

      case 1:
        return this.forceNetwork;

      case 3:
        return this.geomap;

      default:
        return undefined;
    }
  }
}
