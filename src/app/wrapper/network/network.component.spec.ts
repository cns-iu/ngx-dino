import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createStubComponent } from '../../../testing/utility';
import { NetworkComponent } from './network.component';

describe('NetworkComponent', () => {
  let component: NetworkComponent;
  let fixture: ComponentFixture<NetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        createStubComponent('dino-network', {
          inputs: [
            'autoresize', 'width', 'height', 'nodeStream', 'edgeStream',
            'nodeIdField', 'nodePositionField', 'nodeSizeField', 'nodeSymbolField',
            'nodeColorField', 'nodeStrokeField', 'nodeStrokeWidthField', 'nodeLabelPositionField', 'nodeLabelField',
            'nodeTooltipField', 'nodePulseField', 'edgeIdField', 'edgeSourceField', 'edgeTargetField',
            'edgeStrokeField', 'edgeStrokeWidthField', 'edgeTransparencyField', 'nodeTransparencyField', 'strokeTransparencyField'
          ]
        }),
        NetworkComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // FIXME: Ignoring tests for the SONAR setup.
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
