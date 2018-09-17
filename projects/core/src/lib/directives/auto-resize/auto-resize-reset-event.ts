export type AutoResizeResetEvent = Event;
export interface AutoResizeResetEventConstructor {
  new (options?: EventInit): AutoResizeResetEvent;
  readonly eventName: string;
}

const eventName = 'auto-resize-reset';
let constructor: AutoResizeResetEventConstructor;
let prototype: any;

// Old style class due to the way typescript inheritance is transpiled.
function AutoResizeResetEventConstructor(options: EventInit = {}): AutoResizeResetEvent {
  const ev = new Event(eventName, Object.assign({ bubbles: true }, options));
  Object.setPrototypeOf(ev, prototype);
  return ev;
}

constructor = AutoResizeResetEventConstructor as any;
(constructor as any).eventName = eventName;

prototype = constructor.prototype = Object.create(Event.prototype);
prototype.constructor = constructor;

export const AutoResizeResetEvent = constructor;
