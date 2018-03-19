import { vega } from '@ngx-dino/vega';

/*
// FIXME: Need a more generic/angular way to see if in production mode
import { environment } from './../../shared';

const developmentLogLevel = vega.Warn;
export const defaultLogLevel = environment.production ? vega.None : developmentLogLevel;
*/

export const defaultLogLevel = vega.Warn;
