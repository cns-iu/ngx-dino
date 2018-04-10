// tslint:disable:no-bitwise
export class Flags {
  // Stateless indicates that the operator always produces the same value for a
  // specific input value and that the operation is side effect free.
  static Stateless = new Flags(1 << 0);

  // InputIndependent indicates that the input is not used to produce a value
  // and therefore can be replaced with any other input.
  static InputIndependent = new Flags(1 << 1);

  static None = new Flags(0);
  static All = new Flags(0).or(
    Flags.Stateless, Flags.InputIndependent
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
