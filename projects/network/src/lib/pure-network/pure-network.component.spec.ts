import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@ngx-dino/core';
import { EdgeComponent } from '../edge/edge.component';
import { PureNetworkComponent } from './pure-network.component';
import { NodeComponent } from '../node/node.component';

describe('PureNetworkComponent', () => {
  let component: PureNetworkComponent;
  let fixture: ComponentFixture<PureNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, CoreModule],
      declarations: [EdgeComponent, NodeComponent, PureNetworkComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PureNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
