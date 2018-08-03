import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared';
import { ScienceMapModule } from '@ngx-dino/science-map';
import { ScienceMapComponent } from './science-map.component';

describe('ScienceMapComponent', () => {
  let component: ScienceMapComponent;
  let fixture: ComponentFixture<ScienceMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ScienceMapModule],
      declarations: [ ScienceMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScienceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
