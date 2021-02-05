import { Extension } from './extensions.model';

export interface IEditorOptions {
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
  /**
   * Open link in new tab
   */
  targetBlank: boolean;
  /**
   * list user pass extension options
   */
  extensions: {
    [extensionName: string]: any
  };
  /**
   * is spellcheck enable on editor
   */
  spellcheck: boolean;
  placeholder: {
    /**
     * place holder for title
     */
    title: string;
    /**
     * editor content placeholder
     */
    body: string;
    /**
     * image placeholder
     */
    image: string;
    /**
     * media placeholder
     */
    media: string;
  };
}

/**
 * Editor selector can be
 * Id Selector: '#editor'
 * Element: document.getElementById('editor')
 */
export type IEditorSelector = HTMLElement | string;

export interface IMediumEditorOption {
  selector: IEditorSelector;
  otps: IEditorOptions;
}

export class EditorParam implements IMediumEditorOption {
  constructor(public selector: IEditorSelector, public otps: IEditorOptions) {}
}

export interface IDeprecatedExtension {
  /**
   * Extension name
   */
  name: string;

  /**
   * Version that this extension will be removed
   */
  version: string | number;
}
