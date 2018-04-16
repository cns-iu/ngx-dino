// tslint:disable:no-bitwise
export class Flags {
  // Operation always produces the same result for a given input.
  static readonly Stateless = new Flags(1 << 0);

  // Operations output does not depend on the input.
  static readonly InputIndependent = new Flags(1 << 1);

  // Operation has no side effects.
  static readonly SideEffectFree = new Flags(1 << 2);

  static readonly None = new Flags(0);
  static readonly All = new Flags(0).or(
    Flags.Stateless, Flags.InputIndependent, Flags.SideEffectFree
  );


  private constructor(private readonly bits: number) { }


  has(...flags: Flags[]): boolean {
    return this.all(...flags);
  }

  all(...flags: Flags[]): boolean {
    return flags.every((f) => (f.bits & this.bits) === f.bits);
  }

  any(...flags: Flags[]): boolean {
    return flags.some((f) => (f.bits & this.bits) === f.bits);
  }


  not(): Flags {
    return new Flags((~this.bits) & Flags.All.bits);
  }

  or(...flags: Flags[]): Flags {
    return this.reduce((v1, v2) => v1 | v2, flags);
  }

  and(...flags: Flags[]): Flags {
    return this.reduce((v1, v2) => v1 & v2, flags);
  }

  xor(...flags: Flags[]): Flags {
    return this.reduce((v1, v2) => v1 ^ v2, flags);
  }


  // Immutable value interface
  equals(other: any): boolean {
    return other instanceof Flags && this.bits === other.bits;
  }

  hashCode(): number {
    return this.bits;
  }


  private reduce(
    op: (value1: number, value2: number) => number, flags: Flags[]
  ): Flags {
    const result = flags.reduce((acc, f) => op(acc, f.bits), this.bits);
    return new Flags(result);
  }
}
