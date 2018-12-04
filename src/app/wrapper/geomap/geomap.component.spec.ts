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
            'autoresize', 'width', 'height',
            'basemapFeatureSelector', 'basemapProjection', 'basemapColorField', 'basemapTransparencyField',
            'basemapStrokeColorField', 'basemapStrokeWidthField', 'basemapStrokeDashArrayField', 'basemapStrokeTransparencyField',
            'basemapDefaultColor', 'basemapDefaultTransparency', 'basemapDefaultStrokeColor', 'basemapDefaultStrokeWidth',
            'basemapDefaultStrokeDashArray', 'basemapDefaultStrokeTransparency',
            'nodeStream', 'nodeIdField', 'nodePositionField', 'nodeSizeField', 'nodeSymbolField', 'nodeColorField',
            'nodeStrokeColorField', 'nodeStrokeWidthField', 'nodeTooltipField', 'nodeLabelField', 'nodeLabelPositionField',
            'nodeTransparencyField', 'nodePulseField', 'nodeStrokeTransparencyField',
            'edgeStream', 'edgeIdField', 'edgeSourceField', 'edgeTargetField', 'edgeStrokeColorField',
            'edgeStrokeWidthField', 'edgeTransparencyField',
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
