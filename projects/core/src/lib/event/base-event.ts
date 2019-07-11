
export class NgxDinoEvent {
  readonly type: string;
  readonly data: any;
  readonly processed?: any;
  readonly target?: any;
  readonly sourceEvent?: any;

  constructor(type: string, data: any, processed?: any, target?: any, sourceEvent?: any);
  constructor(type: Event, data: any, processed?: any, target?: any);
  constructor(type: string | Event, data: any, processed?: any, target?: any, sourceEvent?: any) {
    this.type = typeof type === 'string' ? type : type.type;
    this.data = data;
    this.processed = processed;
    this.target = target;
    this.sourceEvent = sourceEvent === undefined && typeof type !== 'string' ? type : sourceEvent;
  }
}
