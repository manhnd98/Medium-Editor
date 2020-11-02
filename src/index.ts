import './polyfills';
import './extensions';
import { Utils } from './helpers/utils';
import { Constructor, Extension, ExtensionsNameSpace } from './models/extensions.model';


export class MediumEditor {
  editor: HTMLElement | null;
  utils = new Utils();

  extensions: Constructor<Extension>[] = [];

  constructor(elemId: string, otps: any) {
    this.editor = document.getElementById(elemId);

    if (!this.editor) {
      throw new Error(`Cannot find element with id ${elemId}`);
    }

    if (this.editor.tagName !== 'DIV') {
      console.warn('We recommend editor container is a div');
    }

    this.loadExtensions();

  }

  loadExtensions(): void{
    this.extensions = ExtensionsNameSpace.GetImplementations();
    this.extensions.forEach(e => console.log(e));
  }


}
