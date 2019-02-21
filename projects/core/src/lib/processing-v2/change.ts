
/**
 * Type of `InsertEvent`s.
 */
export interface InsertEvent<TValue extends object> {
  type: 'insert';
  values: ReadonlyArray<TValue>;
}

/**
 * Type of `RemoveEvent`s.
 */
export interface RemoveEvent<TValue extends object> {
  type: 'remove';
  values: ReadonlyArray<TValue>;
}

/**
 * Type of `UpdateEvent`s.
 */
export interface UpdateEvent<TValue extends object> {
  type: 'update';
  keys: PropertyKey[] | 'all';
  values: ReadonlyArray<TValue>;
}

/**
 * Union type of `InsertEvent`s, `RemoveEvent`s, and `UpdateEvent`s.
 */
export type ChangeEvent<TValue extends object = any> =
  InsertEvent<TValue> | RemoveEvent<TValue> | UpdateEvent<TValue>;


export namespace InsertEvent {
  /**
   * Creates an `InsertEvent` from zero or more values.
   *
   * @param values The inserted values.
   */
  export function of<TValue extends object>(...values: TValue[]): InsertEvent<TValue> {
    return { type: 'insert', values };
  }

  /**
   * Creates an `InsertEvent` from an array of values.
   *
   * @param values An array of inserted values.
   */
  export function from<TValue extends object>(values: TValue[]): InsertEvent<TValue> {
    return { type: 'insert', values };
  }
}

export namespace RemoveEvent {
  /**
   * Creates a `RemoveEvent` from zero or more values.
   *
   * @param values The removed values.
   */
  export function of<TValue extends object>(...values: TValue[]): RemoveEvent<TValue> {
    return { type: 'remove', values };
  }

  /**
   * Creates a `RemoveEvent` from an array of values.
   *
   * @param values An array of removed values.
   */
  export function from<TValue extends object>(values: TValue[]): RemoveEvent<TValue> {
    return { type: 'remove', values };
  }
}

export namespace UpdateEvent {
  /**
   * Creates an `UpdateEvent` from zero or more values with updates to the provided keys.
   *
   * @param keys The updated keys of the values.
   * @param values The updated values.
   */
  export function of<TValue extends object>(keys: PropertyKey[] | 'all', ...values: TValue[]): UpdateEvent<TValue> {
    return { type: 'update', keys, values };
  }

  /**
   * Creates an `UpdateEvent` from an array of values with updates to the provided keys.
   *
   * @param keys The updated keys of the values.
   * @param values An array of updated values.
   */
  export function from<TValue extends object>(keys: PropertyKey[] | 'all', values: TValue[]): UpdateEvent<TValue> {
    return { type: 'update', keys, values };
  }
}
