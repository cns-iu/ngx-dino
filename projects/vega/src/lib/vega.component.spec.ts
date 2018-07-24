import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VegaComponent } from './vega.component';

describe('VegaComponent', () => {
  let component: VegaComponent;
  let fixture: ComponentFixture<VegaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VegaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
