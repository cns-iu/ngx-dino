import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolshedComponent } from './toolshed.component';

describe('ToolshedComponent', () => {
  let component: ToolshedComponent;
  let fixture: ComponentFixture<ToolshedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolshedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolshedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
