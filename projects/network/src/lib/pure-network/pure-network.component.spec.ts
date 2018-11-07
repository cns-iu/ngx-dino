import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PureNetworkComponent } from './pure-network.component';

describe('PureNetworkComponent', () => {
  let component: PureNetworkComponent;
  let fixture: ComponentFixture<PureNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PureNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PureNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
