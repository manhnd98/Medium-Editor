export interface Constructor<T> extends Partial<Extension> {
  new (...args: any[]): T;
  readonly prototype: T;
}
export namespace ExtensionsContainer {
  const extensions: Constructor<Extension>[] = [];
  export function getAllExtensions(): Constructor<Extension>[] {
    return extensions;
  }
  export function register(name?: string): any {
    return (constructor: Constructor<Extension>) => {
      if (name) {
        constructor.prototype.name = name;
      }

      extensions.push(constructor);
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
    this.init();
  }

  /**
   * Extension first function int
   */
  init(): void {
    console.log(this.name);
  }
}
