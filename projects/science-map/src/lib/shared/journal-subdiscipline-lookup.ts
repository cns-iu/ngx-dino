import { chain, map, lookup } from '@ngx-dino/core';

import * as journIdToSubdLookup from '../data/journIdToSubdLookup.data';

export const journalIdSubdLookup = lookup(journIdToSubdLookup);
