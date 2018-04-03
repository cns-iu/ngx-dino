// tslint:disable:no-bitwise
export class OperatorFlags {
  static Cachable = new OperatorFlags(1 << 0);
  static InputIndependent = new OperatorFlags(1 << 1);

  static None = new OperatorFlags(0);
  static All = new OperatorFlags(0).or(
    OperatorFlags.Cachable, OperatorFlags.InputIndependent
  );


  private constructor(readonly bits: number) { }


  all(...flags: OperatorFlags[]): boolean {
    return flags.every((f) => (f.bits & this.bits) === f.bits);
  }

  any(...flags: OperatorFlags[]): boolean {
    return flags.some((f) => (f.bits & this.bits) === f.bits);
  }

  has(...flags: OperatorFlags[]): boolean {
    return this.all(...flags);
  }


  not(): OperatorFlags {
    return new OperatorFlags((~this.bits) & OperatorFlags.All.bits);
  }

  or(...flags: OperatorFlags[]): OperatorFlags {
    return this.reduce((v1, v2) => v1 | v2, flags);
  }

  and(...flags: OperatorFlags[]): OperatorFlags {
    return this.reduce((v1, v2) => v1 & v2, flags);
  }

  xor(...flags: OperatorFlags[]): OperatorFlags {
    return this.reduce((v1, v2) => v1 ^ v2, flags);
  }


  private reduce(
    op: (value1: number, value2: number) => number, flags: OperatorFlags[]
  ): OperatorFlags {
    const result = flags.reduce((acc, f) => op(acc, f.bits), this.bits);
    return new OperatorFlags(result);
  }
}
