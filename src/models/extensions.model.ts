export interface Constructor<T> extends Partial<Extension> {
  new (...args: any[]): T;
  readonly prototype: T;
}
export namespace ExtensionsNameSpace {
  const implementations: Constructor<Extension>[] = [];
  export function GetImplementations(): Constructor<Extension>[] {
    return implementations;
  }
  export function register(name?: string): any {
    return (constructor: Constructor<Extension>) => {
      console.log(name);
      console.log(constructor);
      implementations.push(constructor);
      return constructor;
    };
  }
}

export abstract class Extension {
  /**
   * Extension name
   */
  name = '';

  document?: Document;

  constructor(otps: any) {
    const { name, document } = otps;
    this.document = document;
  }

  /**
   * Extension first function int
   */
  init(): void {}
}
