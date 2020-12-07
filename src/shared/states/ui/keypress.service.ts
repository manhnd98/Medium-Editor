import { fromEvent, Observable, Subject } from 'rxjs';
import { InjectToken } from '../../../editor.constant';
import { MediumEditorAttribute } from '../../../shared/models/editor-attribute.model';
import { inject, singleton } from 'tsyringe';

@singleton()
export class KeypressService {
  /**
   * Observable listen event keydown on document
   */
  keydown$!: Observable<KeyboardEvent>;

  /**
   * Observable listen event keydown on editor DOM
   */
  editorKeydown$!: Observable<KeyboardEvent>;

  editorElement: HTMLElement | null;
  constructor(@inject(InjectToken.EDITOR_ID) private editorId: string) {
    this.editorElement = document.querySelector(`[${MediumEditorAttribute.MEDIUM_EDITOR_ID}="${this.editorId}"]`);
    this.listenEvent();
  }

  /**
   * Init keypress event
   */
  listenEvent() {
    this.keydown$ = fromEvent(document, 'keydown') as Observable<KeyboardEvent>;
    this.editorKeydown$ = fromEvent(this.editorElement as HTMLElement, 'keydown') as Observable<KeyboardEvent>;
  }
}
