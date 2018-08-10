import { Component, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { ResizeThrottleSettings, ResizableDirective } from './resizable.directive';


describe('ResizableDirective', () => {
  @Component({
    template: '<div dinoResizable (resized)="callback($event)" [resizeThrottleSettings]="settings"></div>'
  })
  class TestComponent {
    callback = jasmine.createSpy();
    settings: ResizeThrottleSettings = {};
  }

  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  function sendResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  function updateSettings(settings: ResizeThrottleSettings): void {
    component.settings = settings;
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizableDirective, TestComponent ]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sends an event', fakeAsync(() => {
    sendResize();
    flush();
    expect(component.callback).toHaveBeenCalled();
  }));

  it('sends a single event every `wait` milliseconds', fakeAsync(() => {
    updateSettings({leading: false});

    sendResize();
    sendResize();
    tick(100);
    expect(component.callback).toHaveBeenCalledTimes(1);
  }));

  it('sends an event with `width` and `height` changes', fakeAsync(() => {
    const changeMatcher = jasmine.any(SimpleChange);
    const expected = jasmine.objectContaining({width: changeMatcher, height: changeMatcher});

    sendResize();
    flush();
    expect(component.callback).toHaveBeenCalledWith(expected);
  }));
});
