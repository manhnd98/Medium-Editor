import { fromEvent, Observable, Subject } from 'rxjs';
import { InjectToken } from '../../../editor.constant';
import { MediumEditorAttribute } from '../../../shared/models/editor-attribute.model';
import { inject, singleton } from 'tsyringe';
import { filter } from 'rxjs/operators';

@singleton()
export class KeypressService {
  /**
   * Observable listen event keydown on document
   */
  keydown$!: Observable<KeyboardEvent>;

  /**
   * Observable listen event keydown on document
   */
  keypress$!: Observable<KeyboardEvent>;

  /**
   * Observable listen event keydown on editor DOM
   */
  editorKeydown$!: Observable<KeyboardEvent>;

  editorKeypress$!: Observable<KeyboardEvent>;

  editorFocus$!: Observable<Event>;

  editorBlur$!: Observable<Event>;

  editorElement: HTMLElement | null;
  constructor(@inject(InjectToken.EDITOR_ID) private editorId: string) {
    this.editorElement = document.querySelector(
      `[${MediumEditorAttribute.MEDIUM_EDITOR_ID}="${this.editorId}"]`
    );
    this.listenEvent();
  }

  /**
   * Init keypress event
   */
  listenEvent() {
    this.keydown$ = fromEvent(document, 'keydown') as Observable<KeyboardEvent>;
    this.keypress$ = fromEvent(document, 'keypress') as Observable<KeyboardEvent>;
    this.editorFocus$ = fromEvent(this.editorElement as HTMLElement, 'focus');
    this.editorBlur$ = fromEvent(this.editorElement as HTMLElement, 'blur');
    this.editorKeydown$ = fromEvent(this.editorElement as HTMLElement, 'keydown') as Observable<KeyboardEvent>;

    /**
     * Get only printable key
     */
    this.editorKeypress$ = fromEvent(
      this.editorElement as HTMLElement,
      'keypress'
    ) as Observable<KeyboardEvent>;
  }
}
