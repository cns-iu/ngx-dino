import { Operator } from '../operator';

// Do NOT use DataType or Field as values! Will cause circular dependency.
// Allowed to be used as types.
import { DataType, Field } from './field';

export class BoundField<T> {
  constructor(
    readonly id: string,
    readonly field: Field<T>,
    readonly operator: Operator<any, T>
  ) { }


  // Forward accesses/calls to field and operator
  get label(): string {
    return this.field.label;
  }

  get dataType(): DataType {
    return this.field.dataType;
  }

  get(data: any): T {
    return this.operator(data);
  }

  get getter(): (data: any) => T {
    return this.operator;
  }

  toString(): string {
    return `BoundField<id: ${this.id}, field: ${this.field.id}>`;
  }

  /**
   * Equals operator.
   *
   * @deprecated Support for comparing `BoundField`s will be dropped in the future.
   * @param other Another value.
   * @returns True if other === this.
   */
  /* istanbul ignore next */
  equals(other: any): boolean {
    return this === other;
  }

  /**
   * Hashs code.
   *
   * @deprecated Support for hash code will be dropped in the future.
   * @returns The hash code.
   */
  /* istanbul ignore next */
  hashCode(): number {
    return 0;
  }
}
