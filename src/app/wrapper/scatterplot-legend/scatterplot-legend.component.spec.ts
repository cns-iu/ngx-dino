import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared';
import { LegendModule } from '@ngx-dino/legend';
import { ScatterplotLegendComponent } from './scatterplot-legend.component';

describe('ScatterplotLegendComponent', () => {
  let component: ScatterplotLegendComponent;
  let fixture: ComponentFixture<ScatterplotLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, LegendModule],
      declarations: [ ScatterplotLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterplotLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
