import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createStubComponent } from '../../../testing/utility';
import { ForceNetworkComponent } from './force-network.component';

describe('ForceNetworkComponent', () => {
  let component: ForceNetworkComponent;
  let fixture: ComponentFixture<ForceNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        createStubComponent('dino-force-network', {
          inputs: [
            'height', 'width', 'margin', 'autoresize',
            'nodeSizeField', 'nodeIdField', 'nodeColorField', 'nodeLabelField',
            'linkIdField', 'linkSourceField', 'linkTargetField', 'linkSizeField',
            'nodeColorRange', 'nodeSizeRange', 'enableTooltip', 'tooltipTextField',
            'chargeStrength', 'nodeStream', 'linkStream'
          ]
        }),
        ForceNetworkComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
