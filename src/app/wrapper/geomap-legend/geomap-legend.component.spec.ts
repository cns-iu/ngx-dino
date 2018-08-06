import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared';
import { LegendModule } from '@ngx-dino/legend';
import { GeomapLegendComponent } from './geomap-legend.component';

describe('GeomapLegendComponent', () => {
  let component: GeomapLegendComponent;
  let fixture: ComponentFixture<GeomapLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, LegendModule],
      declarations: [ GeomapLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeomapLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
