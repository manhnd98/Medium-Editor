import './polyfills';
import './extensions';
import { Utils } from './helpers/utils';
import { Constructor, Extension, ExtensionsNamespace } from './models/extensions.model';
import { DefaultConfig } from './config/default';
import { MediumEditorOptions } from './models/MediumEditor.model';

export class MediumEditor {
  editors: HTMLCollectionOf<Element>;
  utils = new Utils();
  options: Partial<MediumEditorOptions>;

  extensions: Constructor<Extension>[] = [];

  /**
   *
   * @param selector : HTML Class name
   * @param otps : Medium Editor options
   */
  constructor(selector: string, otps: MediumEditorOptions) {
    this.editors = document.getElementsByClassName(selector);

    if (!this.editors.length) {
      throw new Error(`Cannot find elements with classname ${selector}`);
    }

    this.options = otps;

    // this.loadExtensions();
  }

  get defaults(): Partial<MediumEditorOptions> {
    return DefaultConfig;
  }

  /**
   * Initilize editor
   */
  init(): void {}

  createElementsArray(selector: string): Element[] {
    throw new Error('Not implemented!');
  }

  loadExtensions(): void {
    this.extensions = ExtensionsNamespace.GetImplementations();
    this.extensions.forEach((e) => e.prototype.init());
  }
}
