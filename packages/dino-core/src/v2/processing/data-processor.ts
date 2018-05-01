import { DatumId } from './datum-id';
import { Changes } from './changes';
import { StreamCache } from './caching/stream-cache';


export class DataProcessor<T> {
  private processedCache: StreamCache<T>;

  constructor(
    private rawCache: StreamCache<any>
    // TODO
  ) { }
  // TODO
}
