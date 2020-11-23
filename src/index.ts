import 'reflect-metadata';
import './polyfills';
import { Utils } from './helpers/utils';
import { Constructor, Extension, ExtensionsContainer } from './models/extensions.model';
import { DefaultConfig } from './config/default';
import { MediumEditorOptions, MediumEditorSelector } from './models/medium-editor.model';
import { MediumEditorAttribute } from './models/editor-attribute.enum';

export class MediumEditor {
  utils = new Utils();
  options: Partial<MediumEditorOptions>;
  extensions: Constructor<Extension>[] = [];

  isActive: boolean | undefined = undefined;

  document: Document;

  // Editor elements
  elements: Element[] = [];

  /**
   * @param selector : HTML Class name
   * @param otps : Medium Editor options
   */
  constructor(selector: MediumEditorSelector, otps: MediumEditorOptions) {
    this.document = document;

    this.options = otps;

    if (!this.options.elementsContainer) {
      this.options.elementsContainer = this.options.ownerDocument?.body;
    }

    this.setup();
    // this.loadExtensions();
  }

  setup(): void {
    if (this.isActive) {
      return;
    }
  }

  addElements(selector: MediumEditorSelector): boolean | undefined {
    const elements: Element[] = this.createElementsArray(selector, this.document, true);

    // Do we have elements to add now?
    if (elements.length === 0) {
      return false;
    }

    elements.forEach((element) => {
      // Initialize all new elements (we check that in those functions don't worry)
      // element = initElement.call(this, element, this.id);
      // // Add new elements to our internal elements array
      // this.elements.push(element);
      // // Trigger event so extensions can know when an element has been added
      // this.trigger(
      //     "addElement",
      //     { target: element, currentTarget: element },
      //     element
      // );
    }, this);
  }

  /**
   * Convert MediumEditorSelector to array of HTMLElement
   */
  createElementsArray(
    selector: MediumEditorSelector,
    doc: Document,
    filterEditorElements?: boolean
  ): Element[] {
    const elements: Element[] = [];
    let elementsTemp: Element[] = [];

    if (!selector) {
      elementsTemp = [];
    }

    // if selector is a string, use queryselectorAll
    if (typeof selector === 'string') {
      elementsTemp = [...doc.querySelectorAll(selector)];
    }

    // if selector is a Html Node return its as array
    if (this.utils.isElement(selector)) {
      elementsTemp = [selector as HTMLElement];
    }

    // if selector is NodeListOfElement return its as array
    if (this.utils.isNodeList(selector)) {
      elementsTemp = [...(selector as NodeListOf<Element>)];
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

  get defaults(): Partial<MediumEditorOptions> {
    return DefaultConfig;
  }

  loadExtensions(): void {
    this.extensions = ExtensionsContainer.GetImplementations();
    this.extensions.forEach((e) => e.prototype.init());
  }
}
