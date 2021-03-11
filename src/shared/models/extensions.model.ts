export interface Constructor<T> extends Partial<Extension> {
  new (...args: any): T;
  readonly prototype: T;
}

export interface IExtensionsContainer {
  [name: string]: Constructor<Extension>;
}

export namespace ExtensionsContainer {
  const extensions: IExtensionsContainer = {};

  /**
   * Get extensions with decorator `@extension`
   */
  export function getAllExtensions(): IExtensionsContainer {
    return extensions;
  }
  /**
   * @param id : create an unique id for extension
   * Its used for user to pass optional parameter and editor to init this extension
   */
  export function register(id: string): any {
    return (constructor: Constructor<Extension>) => {
      const existId = extensions[constructor.prototype.id];
      if (existId) {
        throw new Error(`Extension id existed! Please select unique id for your extension ${id}`);
      }

      if (id) {
        constructor.prototype.id = id;
      }

      extensions[id] = constructor;
      return constructor;
    };
  }
}

export interface IExtensionDefaultOption {
  ownerDocument: Document;
  contentWindow: Window;
}

export interface IExtensionOption extends IExtensionDefaultOption {
  [prop: string]: any;
}

export abstract class Extension {
  /**
   * Unique extension id
   */
  id!: string;

  /**
   * Document
   */
  ownerDocument: Document;

  /**
   * Window
   */
  contentWindow: Window;

  /**
   * Init default value for extension ex `ownerDocument` and `contentWindow`
   * @param otps: Extension option
   */
  protected constructor(otps: IExtensionOption) {
    const { ownerDocument, contentWindow } = otps;
    this.ownerDocument = ownerDocument;
    this.contentWindow = contentWindow;
  }

  /**
   * Extension first function int
   */
  init(): void {
    console.log(this.id);
  }
}
