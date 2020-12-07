import { injectable } from 'tsyringe';

@injectable()
export class SelectionHelper {
  constructor() {}

  // http://stackoverflow.com/questions/1197401/how-can-i-get-the-element-the-caret-is-in-with-javascript-when-using-contentedi
  // by You
  getSelectionStart(ownerDocument: Document): HTMLElement{
    const node = ownerDocument.getSelection()?.anchorNode;
    const startNode = node && node.nodeType === 3 ? node.parentNode : node;

    return startNode as HTMLElement;
  }
}
