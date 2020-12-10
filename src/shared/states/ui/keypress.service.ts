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
   * Observable listen event keydown on editor DOM
   */
  editorKeydown$!: Observable<KeyboardEvent>;

  editorKeyPrint$!: Observable<KeyboardEvent>;

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

    /**
     * Get all keydown in editor
     */
    this.editorKeydown$ = fromEvent(
      this.editorElement as HTMLElement,
      'keydown'
    ) as Observable<KeyboardEvent>;

    /**
     * Get only printable key
     */
    this.editorKeyPrint$ = this.editorKeydown$.pipe(
      filter((event) => {
        const keycode = event.keyCode;

        const valid =
          (keycode > 47 && keycode < 58) || // number keys
          keycode == 32 ||
          keycode == 13 || // spacebar & return key(s) (if you want to allow carriage returns)
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223); // [\]' (in order)

        return valid;
      })
    );
  }
}
