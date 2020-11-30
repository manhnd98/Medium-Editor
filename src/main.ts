import { Utils } from './helpers/utils';
import { DefaultConfig } from './config/default';
import { Events } from './helpers/events';
import { inject, injectable } from 'tsyringe';
import { MediumInjectToken } from './editor.constant';
import { EditorParam, EditorParam, IEditorOptions, IMediumEditorOption } from './shared/models/medium-editor.model';
import { Constructor, Extension } from './shared/models/extensions.model';

@injectable()
export class Editor {
  /**
   * Meidum editor option
   */
  options: IEditorOptions;

  /**
   * All extension of medium editor
   */
  extensions: Constructor<Extension>[] = [];

  /**
   * Browser's document
   */
  document: Document;

  // Editor elements
  elements: Element[] = [];

  constructor(
    @inject(EditorParam) private editorParam: EditorParam,
    private utils: Utils
  ) {
    this.document = document;

    this.options = editorParam.otps;

    if (!this.options.elementsContainer) {
      this.options.elementsContainer = this.options.ownerDocument?.body;
    }
  }
}
