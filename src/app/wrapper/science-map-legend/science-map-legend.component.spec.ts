import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared';
import { LegendModule } from '@ngx-dino/legend';
import { ScienceMapLegendComponent } from './science-map-legend.component';

describe('ScienceMapLegendComponent', () => {
  let component: ScienceMapLegendComponent;
  let fixture: ComponentFixture<ScienceMapLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, LegendModule],
      declarations: [ ScienceMapLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScienceMapLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
