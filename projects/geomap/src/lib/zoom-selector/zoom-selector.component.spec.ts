import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomSelectorComponent } from './zoom-selector.component';

describe('ZoomSelectorComponent', () => {
  let component: ZoomSelectorComponent;
  let fixture: ComponentFixture<ZoomSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
