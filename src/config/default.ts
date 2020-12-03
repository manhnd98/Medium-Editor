import { IEditorOptions } from 'src/shared/models/medium-editor.model';

export const DefaultConfig: IEditorOptions = {
  activeButtonClass: 'medium-editor-button-active',
  buttonLabels: false,
  delay: 0,
  disableReturn: false,
  disableDoubleReturn: false,
  disableExtraSpaces: false,
  disableEditing: false,
  autoLink: false,
  elementsContainer: document.body,
  contentWindow: window,
  ownerDocument: document,
  targetBlank: false,
  extensions: [],
  spellcheck: false
};
