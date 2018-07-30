import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceNetworkLegendComponent } from './force-network-legend.component';

describe('ForceNetworkLegendComponent', () => {
  let component: ForceNetworkLegendComponent;
  let fixture: ComponentFixture<ForceNetworkLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceNetworkLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceNetworkLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
