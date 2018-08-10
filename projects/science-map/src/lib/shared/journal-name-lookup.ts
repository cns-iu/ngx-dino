import { chain, map, lookup } from '@ngx-dino/core';

import * as journalNameToIdLookup from '../data/journalNameToId.data';
import { normalizeJournalName } from './normalize-journal-name';

export const journalNameRawLookup = lookup(journalNameToIdLookup);
export const journalNameLookup = chain(map(normalizeJournalName), journalNameRawLookup);
