import { Utils } from './helpers/utils';
import { DefaultConfig } from './config/default';
import { Events } from './helpers/events';
import { container, inject, injectable } from 'tsyringe';
import { InjectToken } from './editor.constant';
import {
  EditorParam,
  IEditorOptions,
  IEditorSelector,
  IMediumEditorOption
} from './shared/models/medium-editor.model';
import { ExtensionsContainer, IExtensionsContainer } from './shared/models/extensions.model';
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
  extensions: IExtensionsContainer = {};

  /**
   * Browser's document
   */
  document: Document;

  // Editor elements
  element!: HTMLElement;

  window: Window;

  /**
   * Check that editor was binded event handle enter
   */
  instanceHandleEditableKeydownEnter = false;

  constructor(
    @inject(EditorParam) private editorParam: EditorParam,
    private utils: Utils,
    private event: Events
  ) {
    /**
     * If editor is running on server side rendering
     * Add try catch to avoid that
     */
    if (typeof window === undefined) {
      throw new Error(
        'Window is undefined! Please handle editor is running on server side rendering'
      );
    }

    this.document = document;
    this.window = window;

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
    this.addElements(selector);

    if (!this.element) {
      return;
    }

    this.isActive = true;
    this.initExtensions();
  }

  /**
   * Init default attribute for editor element
   */
  addElements(selector: IEditorSelector) {
    let element: HTMLElement = this.createElement(selector, this.document, true);
    // Initialize all new elements (we check that in those functions don't worry)
    element = this.initElement(element);
    // Add new elements to our internal elements array
    this.element = element;
  }

  /**
   * Create and select Editor element from selector
   */
  createElement(
    selector: IEditorSelector,
    doc: Document,
    filterEditorElements?: boolean
  ): HTMLElement {
    let element: HTMLElement | null = null;
    let elementTemp: HTMLElement | null = null;

    // if selector is a string, use queryselectorAll
    if (typeof selector === 'string') {
      elementTemp = doc.getElementById(selector);
    }

    // if selector is a Html Node return its as array
    if (this.utils.isElement(selector)) {
      elementTemp = selector as HTMLElement;
    }

    if (filterEditorElements) {
      // Remove elements that have already been initialized by the editor
      // selecotr might not be an array (ie NodeList) so use for loop
      if (
        this.utils.isElement(elementTemp) &&
        !elementTemp?.getAttribute(MediumEditorAttribute.MEDIUM_EDITOR_ELEMENT) &&
        !elementTemp?.getAttribute(MediumEditorAttribute.MEDIUM_EDITOR_ID)
      ) {
        element = elementTemp;
      }
    }

    if (!element) {
      throw new Error(`Invalid selector ${selector}`);
    }

    return element;
  }

  initElement(element: HTMLElement): HTMLElement {
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
      // TODO: Merge data-medium-editor-element and medium-editor-index attributes for 6.0.0
      // medium-editor-index is not named correctly anymore and can be re-purposed to signify
      // whether the element has been initialized or not

      container.register(InjectToken.EDITOR_ID, { useValue: elementId });
      element.setAttribute(MediumEditorAttribute.MEDIUM_EDITOR_ID, elementId);
    }

    return element;
  }

  /**
   * Create contenteditable for textarea
   * @param textarea : textarea element
   * TODO: handle textarea
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
  mergeOptions(defaults: IEditorOptions, options: Partial<IEditorOptions>): IEditorOptions {
    const deprecatedProperties = [];
    return this.utils.defaults({}, options, defaults);
  }

  /**
   * Init extensions
   */
  initExtensions(): void {
    const defaultExtensions = ['core', 'placeholder'];
    this.extensions = ExtensionsContainer.getAllExtensions();
    const coreOption = this.mergeOptions(this.options, {
      contentWindow: this.window,
      ownerDocument: this.document
    });
    defaultExtensions.forEach((extensionName) => {
      const extensionConstructor = this.extensions[extensionName];
      container.register(InjectToken.OPTION_PREFIX + extensionName, { useValue: coreOption });
      container.resolve(extensionConstructor);
    });

    // const option = this.options.extensions['core'];
    // const ext = new this.extensions['c']();
    // console.log(ext);
  }
}
