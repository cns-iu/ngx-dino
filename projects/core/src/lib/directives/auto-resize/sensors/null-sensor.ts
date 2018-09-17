import { NEVER } from 'rxjs';
import { ResizeSensor } from './sensor';


export class NullResizeSensor implements ResizeSensor {
  readonly onResize = NEVER;
  destroy(): void { }
}
