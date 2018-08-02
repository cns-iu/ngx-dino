import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared';
import { GeomapModule } from '@ngx-dino/geomap';
import { GeomapComponent } from './geomap.component';

describe('GeomapComponent', () => {
  let component: GeomapComponent;
  let fixture: ComponentFixture<GeomapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, GeomapModule],
      declarations: [ GeomapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeomapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
