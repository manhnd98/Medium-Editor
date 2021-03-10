import { InjectToken } from '../editor.constant';
import { Extension, ExtensionsContainer } from '../shared/models/extensions.model';
import { IEditorOptions } from '../shared/models/medium-editor.model';
import { inject, injectable } from 'tsyringe';
import { KeyService } from '../shared';
import { merge, Observable } from 'rxjs';
import { SelectionHelper } from '../helpers/selection';
import { EditorClass } from '@model/editor-attribute.model';
import { Utils } from '../helpers/utils';
import { SelectEventService } from '@state/ui/select.service';
import { filter } from 'rxjs/operators';

@ExtensionsContainer.register('placeholder')
@injectable()
/**
 * Handle placeholder events
 */
export class PlaceholderExtension extends Extension {
  /**
   * Document keypress
   */
  keydown$: Observable<KeyboardEvent> = this.keypressService.keydown$;

  /**
   * User click on element in editor DOM
   */
  editorClick$: Observable<Event>;

  constructor(
    @inject(InjectToken.OPTION_PREFIX + 'placeholder') private opts: IEditorOptions,
    private keypressService: KeyService,
    private selectService: SelectEventService,
    private selection: SelectionHelper,
    private utils: Utils
  ) {
    super(opts);
    this.editorClick$ = selectService.editorClick$;
    // keypressService.keydown$.subscribe(event => console.log(event));
    this.init();
  }

  /**
   * Listen events
   */
  init() {
    this.keydown$
      .pipe(
        // Filter only printable character
        // We dont want when we press shift to remove placeholder
        filter((event) => {
          console.log(event.code);
          const keycode = event.keyCode;
          console.log(keycode);
          // [\]' (in order)
          return (
            (keycode > 47 && keycode < 58) || // number keys
            keycode === 32 ||
            keycode === 13 || // spacebar & return key(s) (if you want to allow carriage returns)
            (keycode > 64 && keycode < 91) || // letter keys
            (keycode > 95 && keycode < 112) || // numpad keys
            (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
            (keycode > 218 && keycode < 223)
          );
        })
      )
      .subscribe((event) => this.onPlaceholderKeydown(event));
    merge(
      this.editorClick$,
      this.selectService.editorMouseDown$,
      this.selectService.editorMouseup$
    ).subscribe((event) => this.onPlaceholderClick(event));
  }

  /**
   * When user type key on placeholder, we will remove placeholder and start typing
   * We need to listen to document event keydown instead of element keydown to solve issue
   * https://github.com/manhnd98/Medium-Editor/issues/2
   */
  onPlaceholderKeydown(event: Event) {
    const element = this.selection.getSelectionStart(this.ownerDocument);
    console.log(element);
    // Check is default element

    if (element.classList.contains(EditorClass.DEFAULT_VALUE)) {
      const parentElement = element.parentElement;
      parentElement?.removeChild(element);
    }
  }

  /**
   * Handle event when user click on placeholder element
   */
  onPlaceholderClick(event: Event) {
    const target = event.target as HTMLElement;
    const child = target.firstChild as HTMLElement;
    if (
      target.className.indexOf(EditorClass.DEFAULT_VALUE) > -1 ||
      child.className.indexOf(EditorClass.DEFAULT_VALUE) > -1
    ) {
      event.preventDefault();
      this.selection.moveCursor(this.ownerDocument, target, 0);
    }
  }
}
