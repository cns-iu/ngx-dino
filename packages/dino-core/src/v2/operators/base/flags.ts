// tslint:disable:no-bitwise
export class Flags {
  // Individual flags
  // ----------------

  // Operation always produces the same result for a given input.
  static readonly Stateless = new Flags(1 << 0, 'Stateless');

  // Operations output does not depend on the input.
  static readonly InputIndependent = new Flags(1 << 1, 'InputIndependent');

  // Operation has no side effects.
  static readonly SideEffectFree = new Flags(1 << 2, 'SideEffectFree');

  // List of individual flags
  // ------------------------
  private static readonly FlagList: Flags[] = [
    Flags.Stateless,
    Flags.InputIndependent,
    Flags.SideEffectFree
  ];

  // Special/Combination flags
  // -------------------------
  static readonly None = new Flags(0, 'None');
  static readonly All = Flags.combine(...Flags.FlagList).withName('All');


  private constructor(
    private readonly bits: number,
    private _name?: string
  ) { }


  get name(): string {
    if (this._name === undefined) {
      this._name = this.getNames().join('|');
    }

    return `Flags<${this._name}>`;
  }


  static combine(...flags: Flags[]): Flags {
    return Flags.None.or(...flags);
  }


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


  // toString
  toString(): string {
    return this.name;
  }


  // or/and/xor implemenation utility
  private reduce(
    op: (value1: number, value2: number) => number, flags: Flags[]
  ): Flags {
    const result = flags.reduce((acc, f) => op(acc, f.bits), this.bits);
    return new Flags(result);
  }


  // Name utility
  private withName(name: string): Flags {
    return new Flags(this.bits, name);
  }

  private getNames(): string[] {
    if (this.bits === Flags.None.bits) {
      return [Flags.None._name];
    } else if (this.bits === Flags.All.bits) {
      return [Flags.All._name];
    } else {
      return Flags.FlagList
        .filter((flag) => this.has(flag))
        .map((flag) => flag._name);
    }
  }
}
