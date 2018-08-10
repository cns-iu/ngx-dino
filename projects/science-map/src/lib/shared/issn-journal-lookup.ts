import { chain, map, lookup } from '@ngx-dino/core';

import * as issnToJournIdLookup from '../data/issnToJournIdLookup.data';
import { normalizeIssn } from './normalize-issn';

export const issnRawLookup = lookup<string, any>(<any>issnToJournIdLookup);
export const issnLookup = chain(map(normalizeIssn), issnRawLookup);
