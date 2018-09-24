export type AutoResizeResetEvent = Event;
export interface AutoResizeResetEventConstructor {
  new (options?: EventInit): AutoResizeResetEvent;
  readonly eventName: string;
}

const BaseEvent = typeof Event !== 'undefined' ? Event : <any>class Event {
  constructor(readonly name: string, readonly options?: any) { }
}

const eventName = 'auto-resize-reset';
let constructor: AutoResizeResetEventConstructor;
let prototype: any;

// Old style class due to the way typescript inheritance is transpiled.
function AutoResizeResetEventConstructorFunction(options: EventInit = {}): AutoResizeResetEvent {
  const ev = new BaseEvent(eventName, Object.assign({ bubbles: true }, options));
  Object.setPrototypeOf(ev, prototype);
  return ev;
}

constructor = AutoResizeResetEventConstructorFunction as any;
(constructor as any).eventName = eventName;

prototype = constructor.prototype = Object.create(BaseEvent.prototype);
prototype.constructor = constructor;

export const AutoResizeResetEvent = constructor;
