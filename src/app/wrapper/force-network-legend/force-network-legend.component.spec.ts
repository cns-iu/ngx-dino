import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared';
import { LegendModule } from '@ngx-dino/legend';
import { ForceNetworkLegendComponent } from './force-network-legend.component';

describe('ForceNetworkLegendComponent', () => {
  let component: ForceNetworkLegendComponent;
  let fixture: ComponentFixture<ForceNetworkLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, LegendModule],
      declarations: [ ForceNetworkLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceNetworkLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
