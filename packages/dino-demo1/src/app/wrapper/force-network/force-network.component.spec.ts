import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceNetworkComponent } from './force-network.component';

describe('ForceNetworkComponent', () => {
  let component: ForceNetworkComponent;
  let fixture: ComponentFixture<ForceNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
