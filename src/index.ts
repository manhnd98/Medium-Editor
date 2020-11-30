import 'reflect-metadata';
import './polyfills';
import { autoInjectable, container, inject, injectable, InjectionToken } from 'tsyringe';
import { Editor } from './main';

import { MediumInjectToken } from './editor.constant';
import { EditorParam, IEditorOptions, IEditorSelector } from './shared/models/medium-editor.model';

export class MediumEditor {
  editor: Editor;
  constructor(selector: IEditorSelector, otps: IEditorOptions) {
    container.register(EditorParam, { useValue: new EditorParam(selector, otps) });
    this.editor = container.resolve(Editor);
  }
}
