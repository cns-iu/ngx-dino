import { Component } from '@angular/core';
import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableDirective } from './resizable.directive';

describe('ResizableDirective', () => {
  describe('ClassTests', () => {
    it('creates an instance', () => {
      const directive = new ResizableDirective();
      expect(directive).toBeTruthy();
    });
  });

  describe('ComponentTests', () => {
    @Component({
      template: `
      <div [dinoResizable]="onResize1"></div>
      <div [dinoResizable]="onResize2" resizeThrottleWait="200"></div>
      ` // TODO:
    })
    class TestComponent {
      onResize1 = jasmine.createSpy();
      onResize2 = jasmine.createSpy();
    }

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ ResizableDirective, TestComponent ]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      tick();
    }));

    it('invokes the callback', fakeAsync(() => {
      window.dispatchEvent(new Event('resize'));
      flush();
      expect(component.onResize1).toHaveBeenCalledTimes(1);
    }));

    it('invokes the callback once every throttle interval', fakeAsync(() => {
      // Reset call count after the leading edge
      window.dispatchEvent(new Event('resize'));
      flushMicrotasks();
      component.onResize1.calls.reset();

      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      tick(100);
      expect(component.onResize1).toHaveBeenCalledTimes(1);

      flush();
    }));

    it('invokes the callback after the specified wait time', fakeAsync(() => {
      // Reset call count after the leading edge
      window.dispatchEvent(new Event('resize'));
      flushMicrotasks();
      component.onResize2.calls.reset();

      window.dispatchEvent(new Event('resize'));
      tick(100);
      expect(component.onResize2).not.toHaveBeenCalled();

      tick(200 - 100);
      expect(component.onResize2).toHaveBeenCalled();

      flush();
    }));
  });
});
