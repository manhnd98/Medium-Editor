import { Utils } from './helpers/utils';
import { DefaultConfig } from './config/default';
import { Events } from './helpers/events';
import { inject, injectable } from 'tsyringe';
import { MediumInjectToken } from './editor.constant';
import {
  EditorParam,
  IEditorOptions,
  IEditorSelector,
  IMediumEditorOption
} from './shared/models/medium-editor.model';
import { Constructor, Extension, ExtensionsContainer } from './shared/models/extensions.model';
import { MediumEditorAttribute } from './shared/models/editor-attribute.model';
import { v4 } from 'uuid';

@injectable()
export class Editor {
  /**
   * Is editor was activated
   */
  isActive = false;

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

  /**
   * Check that editor was binded event handle enter
   */
  instanceHandleEditableKeydownEnter = false;

  constructor(
    @inject(EditorParam) private editorParam: EditorParam,
    private utils: Utils,
    private event: Events
  ) {
    this.document = document;
    this.options = this.mergeOptions(DefaultConfig, editorParam.otps);

    if (!this.options.elementsContainer) {
      this.options.elementsContainer = this.options.ownerDocument?.body;
    }

    this.setup(editorParam.selector);
  }

  /**
   * Start editor
   */
  setup(selector: IEditorSelector): void {
    /**
     * if editor already activated then stop init
     */
    if (this.isActive) {
      return;
    }
    this.elements = [];
    this.addElements(selector);

    if (this.elements.length === 0) {
      return;
    }

    this.isActive = true;
    this.initExtensions();
  }

  addElements(selector: IEditorSelector): boolean | undefined {
    const elements: HTMLElement[] = this.createElementsArray(selector, this.document, true);

    // Do we have elements to add now?
    if (elements.length === 0) {
      return false;
    }

    elements.forEach((element) => {
      // Initialize all new elements (we check that in those functions don't worry)
      element = this.initElement(element, v4());
      // Add new elements to our internal elements array
      this.elements.push(element);
    }, this);
  }

  /**
   * Convert MediumEditorSelector to array of HTMLElement
   */
  createElementsArray(
    selector: IEditorSelector,
    doc: Document,
    filterEditorElements?: boolean
  ): HTMLElement[] {
    const elements: HTMLElement[] = [];
    let elementsTemp: HTMLElement[] = [];

    if (!selector) {
      elementsTemp = [];
    }

    // if selector is a string, use queryselectorAll
    if (typeof selector === 'string') {
      elementsTemp = [...doc.querySelectorAll(selector)] as HTMLElement[];
    }

    // if selector is a Html Node return its as array
    if (this.utils.isElement(selector)) {
      elementsTemp = [selector as HTMLElement];
    }

    // if selector is NodeListOfElement return its as array
    if (this.utils.isNodeList(selector)) {
      elementsTemp = [...(selector as NodeListOf<HTMLElement>)];
    }

    if (filterEditorElements) {
      // Remove elements that have already been initialized by the editor
      // selecotr might not be an array (ie NodeList) so use for loop
      for (const el of elementsTemp) {
        if (
          this.utils.isElement(el) &&
          !el.getAttribute(MediumEditorAttribute.MEDIUM_EDITOR_ELEMENT) &&
          !el.getAttribute(MediumEditorAttribute.MEDIUM_EDITOR_ID)
        ) {
          elements.push(el);
        }
      }
    }

    return elements;
  }

  initElement(element: HTMLElement, editorId: string): HTMLElement {
    /**
     * If editor was not initialized before
     */
    if (!element.getAttribute(MediumEditorAttribute.MEDIUM_EDITOR_ELEMENT)) {
      // set attribute editable for div
      if (!this.options.disableEditing && !element.getAttribute('data-disable-editing')) {
        element.setAttribute('contenteditable', 'true');
        element.setAttribute('spellcheck', this.options.spellcheck.toString());
      }

      const elementId = v4();

      element.setAttribute(MediumEditorAttribute.MEDIUM_EDITOR_ELEMENT, 'true');
      element.classList.add('medium-editor-element');
      element.setAttribute('role', 'textbox');
      element.setAttribute('aria-multiline', 'true');
      element.setAttribute('data-medium-editor-editor-index', editorId);
      // TODO: Merge data-medium-editor-element and medium-editor-index attributes for 6.0.0
      // medium-editor-index is not named correctly anymore and can be re-purposed to signify
      // whether the element has been initialized or not
      element.setAttribute('medium-editor-index', elementId);
    }

    return element;
  }

  /**
   * Create contenteditable for textarea
   * @param textarea : textarea element
   */
  createContentEditable(textarea: HTMLTextAreaElement): HTMLDivElement {
    const div = this.options.ownerDocument.createElement('div');
    let now = Date.now();
    let uniqueId = MediumEditorAttribute.MEDIUM_EDITOR_ID + now;
    const atts = textarea.attributes;

    // Some browsers can move pretty fast, since we're using a timestamp
    // to make a unique-id, ensure that the id is actually unique on the page
    while (this.options.ownerDocument.getElementById(uniqueId)) {
      now++;
      uniqueId = 'medium-editor-' + now;
    }

    div.className = textarea.className;
    div.id = uniqueId;
    div.innerHTML = textarea.value;

    textarea.setAttribute('medium-editor-textarea-id', uniqueId);

    // re-create all attributes from the textearea to the new created div
    for (let i = 0, n = atts.length; i < n; i++) {
      // do not re-create existing attributes
      if (!div.hasAttribute(atts[i].nodeName)) {
        div.setAttribute(atts[i].nodeName, atts[i].value);
      }
    }

    // If textarea has a form, listen for reset on the form to clear
    // the content of the created div
    if (textarea.form) {
      // this.on(
      //   textarea.form,
      //   'reset',
      //   function (event) {
      //     if (!event.defaultPrevented) {
      //       this.resetContent(this.options.ownerDocument.getElementById(uniqueId));
      //     }
      //   }.bind(this)
      // );
    }

    textarea.classList.add('medium-editor-hidden');
    textarea.parentNode?.insertBefore(div, textarea);

    return div;
  }

  /**
   * Merge default config with user config
   */
  mergeOptions(defaults: IEditorOptions, options: IEditorOptions): IEditorOptions {
    const deprecatedProperties = [];
    return this.utils.defaults({}, options, defaults);
  }

  /**
   * get all extensions from registered with decorator `@extension`
   */
  initExtensions(): void {
    this.extensions = ExtensionsContainer.getAllExtensions();
    this.extensions.forEach((extension) => {
    });
  }
}
