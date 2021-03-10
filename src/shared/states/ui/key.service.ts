import { fromEvent, Observable, Subject } from 'rxjs';
import { InjectToken } from '../../../editor.constant';
import { MediumEditorAttribute } from '@model';
import { inject, singleton } from 'tsyringe';
import { filter } from 'rxjs/operators';

@singleton()
export class KeyService {
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

  /**
   * Observable event keydown but only printable key
   */
  editorKeydownPrintable$!: Observable<Event>;
  constructor(
    @inject(InjectToken.EDITOR_ID) private editorId: string,
    @inject(InjectToken.DOCUMENT) private _document: Document
  ) {
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
    this.editorKeydown$ = fromEvent(
      this.editorElement as HTMLElement,
      'keydown'
    ) as Observable<KeyboardEvent>;

    /**
     * Get only printable key
     */
    this.editorKeypress$ = fromEvent(
      this.editorElement as HTMLElement,
      'keypress'
    ) as Observable<KeyboardEvent>;

    this.editorKeydownPrintable$ = (fromEvent(
      this._document,
      'keydown'
    ) as Observable<KeyboardEvent>).pipe(
      // Filter to get event keydown from editor
      filter((event: KeyboardEvent) => !!this.editorElement?.contains(event.currentTarget as Node)),
      filter((event: KeyboardEvent) => {
        console.log(event.key, event.code);
        return true;
      })
    );
  }
}
