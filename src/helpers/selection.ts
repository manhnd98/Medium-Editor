import { injectable } from 'tsyringe';
import { SelectionRange } from 'typescript';

@injectable()
export class SelectionHelper {
  constructor() {}

  // http://stackoverflow.com/questions/1197401/how-can-i-get-the-element-the-caret-is-in-with-javascript-when-using-contentedi
  // by You
  getSelectionStart(ownerDocument: Document): HTMLElement {
    const node = ownerDocument.getSelection()?.anchorNode;
    const startNode = node && node.nodeType === 3 ? node.parentNode : node;
    return startNode as HTMLElement;
  }

  /**
   * Move cursor to the given node with the given offset.
   * @param doc     Current document
   * @param node    Element where to jump
   * @param offset  Where in the element should we jump, 0 by default
   */
  moveCursor(doc: Document, node: Node, offset: number) {
    this.select(doc, node, offset);
  }

  select(doc: Document, startNode: Node, startOffset: number, endNode?: Node, endOffset = 0) {
    const range = doc.createRange();
    range.setStart(startNode, startOffset);
    if (endNode) {
      range.setEnd(endNode, endOffset);
    } else {
      range.collapse(true);
    }
    this.selectRange(doc, range);
    return range;
  }

  /**
   * Select range in document
   * @param document: Document element
   * @param range : Selection Range
   */
  selectRange(document: Document, range: Range): void{
    const selection = document.getSelection();

    selection?.removeAllRanges();
    selection?.addRange(range);
  }
}
