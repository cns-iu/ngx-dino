import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createStubComponent } from '../../../testing/utility';
import { ScienceMapComponent } from './science-map.component';

describe('ScienceMapComponent', () => {
  let component: ScienceMapComponent;
  let fixture: ComponentFixture<ScienceMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        createStubComponent('dino-science-map', {
          inputs: [
            'subdisciplineSizeField', 'subdisciplineIdField', 'tooltipTextField',
            'dataStream', 'height', 'width', 'margin', 'minPositionX',
            'minPositionY', 'autoresize', 'nodeSizeRange', 'enableTooltip'
          ],
          outputs: [
            'nodeClicked'
          ]
        }),
        ScienceMapComponent
      ]
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
