import { is } from 'immutable';


export default function(first: any, second: any): boolean {
  return is(first, second) || undefined;
}
