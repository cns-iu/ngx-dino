import { lookup, Operator } from '@ngx-dino/core';

import * as journIdToSubdLookup from '../data/journIdToSubdLookup.data';

export const journalIdSubdLookup: Operator<string, any> = lookup(journIdToSubdLookup);
