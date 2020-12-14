import { IEditorOptions } from 'src/shared/models/medium-editor.model';
import { Browser } from '../shared/models/browser.model';

export class Utils {
  constructor() {}

  isInternetExplorer(): boolean {
    return (
      navigator.appName === 'Microsoft Internet Explorer' ||
      (navigator.appName === 'Netscape' &&
        new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) !== null)
    );
  }

  isEdge(): boolean {
    return /Edge\/\d+/.exec(navigator.userAgent) !== null;
  }

  isFireFox(): boolean {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }

  isMac(): boolean {
    return window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

  isMobile(): boolean {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];

    return (
      toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
      }) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  /**
   * Get current browser type
   * If function cannot detect browser type, its will return undefined
   */
  getBrower(): Browser | undefined {
    if (this.isInternetExplorer()) {
      return Browser.InternetExplorer;
    }

    if (this.isEdge()) {
      return Browser.Edge;
    }

    if (this.isFireFox()) {
      return Browser.Firefox;
    }

    if (this.isMac()) {
      return Browser.Mac;
    }

    if (this.isMobile()) {
      return Browser.Mobile;
    }

    return undefined;
  }

  /**
   * Check parameter is a HTML element or not
   * @param element : HTML element or selector
   */
  // https://github.com/jashkenas/underscore
  isElement(obj: any): boolean {
    return !!(obj && obj.nodeType === 1);
  }

  /**
   * https://stackoverflow.com/questions/7238177/how-to-detect-htmlcollection-nodelist-in-javascript
   *
   * Check parameter is html nodelist or not
   */
  isNodeList(obj: any): boolean {
    return NodeList.prototype.isPrototypeOf(obj);
  }

  /**
   * https://stackoverflow.com/questions/7238177/how-to-detect-htmlcollection-nodelist-in-javascript
   *
   * Check element is html collection or not
   */
  isHTMLCollection(obj: any): boolean {
    return HTMLCollection.prototype.isPrototypeOf(obj);
  }

  defaults(dest: any, source1: any, source2: any): any {
    const args = [false].concat(Array.prototype.slice.call(arguments));
    return this.copyInto.apply(this, args as any);
  }

  copyInto(overwrite: any, dest: any): any {
    const sources = Array.prototype.slice.call(arguments, 2);
    dest = dest || {};
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      if (source) {
        for (const prop in source) {
          if (
            source.hasOwnProperty(prop) &&
            typeof source[prop] !== 'undefined' &&
            (overwrite || dest.hasOwnProperty(prop) === false)
          ) {
            dest[prop] = source[prop];
          }
        }
      }
    }
    return dest;
  }

  /**
   * Shorter way to create a element with content and class
   * @param document : Document element
   * @param tagName : Element tagName or nodeName
   * @param content : HTML element or string to append as child element
   * @param classList: Class name to append to new element
   */
  createElement(
    document: Document,
    tagName: string,
    content: string | HTMLElement,
    className?: string
  ): HTMLElement {
    const element = document.createElement(tagName);
    if (this.isElement(content)) {
      element.appendChild(content as HTMLElement);
    } else {
      element.innerHTML = content as string;
    }

    if (className) {
      element.className += element.className + className;
    }

    return element;
  }

  /**
   * Section divider is a element to separate between section
   * @param document: HTML Document
   */
  createSectionDivider(document: Document) {
    const hr = this.createElement(document, 'hr', '', 'section-divider');
    return this.createElement(document, 'div', hr, 'section-divider');
  }

  /**
   * Check element is a editor element
   */
  isMediumEditorElement(element: HTMLElement | any) {
    return element && element.getAttribute && !!element.getAttribute('data-medium-editor-element');
  }

  // http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
  insertHTMLCommand(doc: Document, html: string) {
    // tslint:disable-next-line: one-variable-per-declaration
    let selection, range, el, fragment, node, lastNode, toReplace;
    let res = false;

    /* Edge's implementation of insertHTML is just buggy right now:
     * - Doesn't allow leading white space at the beginning of an element
     * - Found a case when a <font size="2"> tag was inserted when calling alignCenter inside a blockquote
     *
     * There are likely other bugs, these are just the ones we found so far.
     * For now, let's just use the same fallback we did for IE
     */
    if (!this.isEdge() && doc.queryCommandSupported('insertHTML')) {
      try {
        return doc.execCommand.apply(doc, ['insertHTML', false, html]);
      } catch (ignore) {}
    }

    selection = doc.getSelection();
    if (selection?.rangeCount) {
      range = selection.getRangeAt(0);
      toReplace = range.commonAncestorContainer;

      // https://github.com/yabwe/medium-editor/issues/748
      // If the selection is an empty editor element, create a temporary text node inside of the editor
      // and select it so that we don't delete the editor element
      if (this.isMediumEditorElement(toReplace) && !toReplace.firstChild) {
        range.selectNode(toReplace.appendChild(doc.createTextNode('')));
      } else if (
        (toReplace.nodeType === 3 &&
          range.startOffset === 0 &&
          range.endOffset === toReplace.nodeValue?.length) ||
        (toReplace.nodeType !== 3 && (toReplace as any).innerHTML === range.toString())
      ) {
        // Ensure range covers maximum amount of nodes as possible
        // By moving up the DOM and selecting ancestors whose only child is the range
        while (
          this.isMediumEditorElement(toReplace) &&
          toReplace.parentNode &&
          toReplace.parentNode.childNodes.length === 1 &&
          this.isMediumEditorElement(toReplace.parentNode)
        ) {
          toReplace = toReplace.parentNode;
        }
        range.selectNode(toReplace);
      }
      range.deleteContents();

      el = doc.createElement('div');
      el.innerHTML = html;
      fragment = doc.createDocumentFragment();
      while (el.firstChild) {
        node = el.firstChild;
        lastNode = fragment.appendChild(node);
      }
      range.insertNode(fragment);

      // Preserve the selection:
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        // MediumEditor.selection.selectRange(doc, range);
      }
      res = true;
    }

    // https://github.com/yabwe/medium-editor/issues/992
    // If we're monitoring calls to execCommand, notify listeners as if a real call had happened
    // if (doc.execCommand.callListeners) {
    //   doc.execCommand.callListeners(ecArgs, res);
    // }
    return res;
  }

  /**
   * Create placeholder for editor
   * @param ownerDocument : Document
   * @param value : content of placeholder
   */
  createPlaceholder(ownerDocument: Document, value: string) {
    const span = this.createElement(
      ownerDocument,
      'span',
      value,
      'defaultValue defaultValue--root'
    );

    const br = ownerDocument.createElement('br');

    return { span, br };
  }
}
