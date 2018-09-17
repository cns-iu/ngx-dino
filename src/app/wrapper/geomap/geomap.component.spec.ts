import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createStubComponent } from '../../../testing/utility';
import { GeomapComponent } from './geomap.component';

describe('GeomapComponent', () => {
  let component: GeomapComponent;
  let fixture: ComponentFixture<GeomapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        createStubComponent('dino-geomap', {
          inputs: [
            'autoresize', 'width', 'height', 'stateDataStream', 'pointDataStream',
            'pointIdField', 'pointLatLongField', 'pointTitleField', 'pointSizeField',
            'pointColorField', 'strokeColorField', 'pointShapeField', 'pointPulseField',
            'stateField', 'stateColorField', 'stateDefaultColor', 'stateDefaultStrokeColor'
          ]
        }),
        GeomapComponent
      ]
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
