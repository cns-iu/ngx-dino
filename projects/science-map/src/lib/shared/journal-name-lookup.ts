import { chain, map, lookup, Operator } from '@ngx-dino/core';

import * as journalNameToIdLookup from '../data/journalNameToId.data';
import { normalizeJournalName } from './normalize-journal-name';

export const journalNameRawLookup: Operator<string, any> = lookup(journalNameToIdLookup);
export const journalNameLookup: Operator<string, any> = chain(map(normalizeJournalName), journalNameRawLookup);
