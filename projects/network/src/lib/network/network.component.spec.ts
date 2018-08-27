import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@ngx-dino/core';
import { EdgeComponent } from '../edge/edge.component';
import { NetworkComponent } from './network.component';
import { NodeComponent } from '../node/node.component';

describe('NetworkComponent', () => {
  let component: NetworkComponent;
  let fixture: ComponentFixture<NetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, CoreModule],
      declarations: [ EdgeComponent, NetworkComponent, NodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
