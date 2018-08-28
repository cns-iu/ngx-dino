import { lookup, Operator } from '@ngx-dino/core';

import journIdToSubdLookup from '../data/journIdToSubdLookup.data';

export const journalIdSubdLookup: Operator<string, any> = lookup(journIdToSubdLookup);
