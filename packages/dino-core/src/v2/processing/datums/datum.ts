import { DatumId, isDatumId, extractId } from './datum-id';


export const idSymbol = '__ngx-dino-datum-id__';
export const rawDataSymbol = '__ngx-dino-datum-raw-data__';


export function isDatum(obj: any): obj is Datum {
  return obj && isDatumId(obj[idSymbol]);
}


export class Datum<R = any> {
  readonly '__ngx-dino-datum-id__': DatumId;
  readonly '__ngx-dino-datum-raw-data__'?: R;


  constructor(id: DatumId, rawData?: R) {
    this[idSymbol] = id;
    this[rawDataSymbol] = rawData;
  }
}
