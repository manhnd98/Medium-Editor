import './polyfills';
import { Utils } from './helpers/utils';

export class MediumEditor {
  editor: HTMLElement | null;
  utils = new Utils();

  constructor(elemId: string, otps: any) {
    this.editor = document.getElementById(elemId);

    if (!this.editor) {
      throw new Error(`Cannot find element with id ${elemId}`);
    }

    if (this.editor.tagName !== 'DIV') {
      console.warn('We recommend editor container is a div');
    }
  }
}
