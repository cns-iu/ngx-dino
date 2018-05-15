import { vega } from './vega';
import { ChangeSet, DatumId, isDatumId, idSymbol } from '@ngx-dino/core';

function addToSet<T>(changeSet: any, items: T[]): void {
  changeSet.insert(items);
}

function removeFromSet<T>(changeSet: any, items: (T | DatumId)[], key: any): void {
  const removeSet = {};
  items.forEach((value) => {
    const id = isDatumId(value) ? value : value[key];
    removeSet[id] = true;
  });

  changeSet.remove((value) => {
    return removeSet[value[key]];
  });
}

function updateInSet<T>(changeSet: any, items: [T | DatumId, Partial<T>][], key: any): void {
  const changesById = {};
  const changedFields = {};

  items.forEach(([valueOrId, change]) => {
    const id = isDatumId(valueOrId) ? valueOrId : valueOrId[key];
    changesById[id] = change;

    Object.keys(change).forEach((field) => {
      changedFields[field] = true;
    });
  });

  Object.keys(changedFields).forEach((field) => {
    changeSet.modify((value) => {
      const change = changesById[value[key]];
      return change && change[field] != null;
    }, field, (value) => {
      return changesById[value[key]][field];
    });
  });
}

export function makeChangeSet<T>(change: ChangeSet<T>, key: keyof T): any {
  const changeSet = new vega.changeset();
  addToSet(changeSet, change.insert.toArray());
  removeFromSet(changeSet, change.remove.toArray(), key);
  updateInSet(changeSet, change.update.map((d): [any, any] => {
    return [d[idSymbol], d];
  }).toArray(), key);
  updateInSet(changeSet, change.replace.map((d): [any, any] => {
    return [d[idSymbol], d];
  }).toArray(), key);

  return changeSet;
}
