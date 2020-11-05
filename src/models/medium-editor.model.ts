export interface MediumEditorOptions {
  activeButtonClass: string;
  buttonLabels: boolean;
  delay: number;
  disableReturn: boolean;
  disableDoubleReturn: boolean;
  disableExtraSpaces: boolean;
  disableEditing: boolean;
  autoLink: boolean;
  elementsContainer: HTMLElement;
  contentWindow: Window;
  ownerDocument: Document;
  targetBlank: boolean;
  extensions: object;
  spellcheck: boolean;
}

/**
 * Editor selector can be
 * Selector: '.editor' | '#editor'
 * Collection of Element: document.getElementsByClassName('editor')
 * Element: document.getElementById('editor')
 */
export type MediumEditorSelector = HTMLCollectionOf<Element> | HTMLElement | NodeListOf<Element> | string;
