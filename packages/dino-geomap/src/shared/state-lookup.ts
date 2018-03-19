const stateMappingData: any = require('./state-mapping.json');

// Tables
const stateByName = (stateMappingData as any[]).reduce((result, state) => {
  result[state.name.toLowerCase()] = state;
  return result;
}, {});

const stateByAbbr = (stateMappingData as any[]).reduce((result, state) => {
  result[state.abbr.toLowerCase()] = state;
  return result;
}, {});

export function lookupStateCode(name: string): number {
  name = name.toLowerCase();
  const state = stateByName[name] || stateByAbbr[name];
  return state ? state.id : -1;
}
