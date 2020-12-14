import { fromEvent, Observable } from 'rxjs';
import { InjectToken } from 'src/editor.constant';
import { inject, singleton } from 'tsyringe';

@singleton()
export class SelectEventService {
  /**
   * Document click event
   */
  click$: Observable<Event>;

  /**
   * Event click on editor element
   */
  editorClick$: Observable<Event>;

  constructor(
    @inject(InjectToken.EDITOR) private editor: HTMLElement,
    @inject(InjectToken.DOCUMENT) private document: Document
  ) {
    this.click$ = fromEvent(document, 'click');

    this.editorClick$ = fromEvent(editor, 'click');
  }
}
