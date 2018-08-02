import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared';
import { ScatterplotModule } from '@ngx-dino/scatterplot';
import { ScatterplotComponent } from './scatterplot.component';

describe('ScatterplotComponent', () => {
  let component: ScatterplotComponent;
  let fixture: ComponentFixture<ScatterplotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ScatterplotModule],
      declarations: [ ScatterplotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
