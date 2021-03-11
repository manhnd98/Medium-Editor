import { InjectToken } from '../editor.constant';
import { IEditorOptions, Extension, ExtensionsContainer } from '@model';
import { inject, injectable } from 'tsyringe';
import { KeyService } from '../shared';
import { merge, Observable } from 'rxjs';
import { SelectionHelper } from '../helpers/selection';
import { EditorClass } from '@model';
import { Utils } from '../helpers/utils';
import { SelectEventService } from '@state/ui/select.service';
import { filter, map, mapTo } from 'rxjs/operators';
import { isKeyPrintable, LEFT_ARROW, RIGHT_ARROW } from '@cdk/keycodes';

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

  /** Listen events */
  init() {
    // Event handle remove placeholder
    // when user start typing
    this.keydown$
      .pipe(
        // Filter only printable character
        // only printable key can remove placeholder
        filter((event) => isKeyPrintable(event))
      )
      .subscribe((event) => this.onPlaceholderKeydown(event));

    // Prevent user move cursor around placeholder span
    merge(
      this.selectService.editorMouseDown$.pipe(map((event) => ({ event, element: event.target }))),
      this.keydown$.pipe(
        filter((event) => event.keyCode === LEFT_ARROW || event.keyCode === RIGHT_ARROW),
        map((event) => ({ event, element: this.selection.getSelectionStart(this.ownerDocument) }))
      )
    ).subscribe(({ event, element }) => this.onPlaceholderClick(event, element));
  }

  /**
   * When user type key on placeholder, we will remove placeholder and start typing
   * We need to listen to document event keydown instead of element keydown to solve issue
   * https://github.com/manhnd98/Medium-Editor/issues/2
   */
  onPlaceholderKeydown(event: Event) {
    // Get current focus element in our editor
    let element = this.selection.getSelectionStart(this.ownerDocument);
    const firstChild = element.firstElementChild;

    // element got from selection can be parent of <span> placeholder element
    // therefore, we will want to check first child of this element
    // and re-assign placeholder element
    if (
      firstChild?.nodeName === 'span' &&
      firstChild?.classList.contains(EditorClass.DEFAULT_VALUE)
    ) {
      element = firstChild as HTMLElement;
    }

    if (element.classList.contains(EditorClass.DEFAULT_VALUE)) {
      const parentElement = element.parentElement;
      parentElement?.removeChild(element);
    }
  }

  /**
   * Handle event when user click on placeholder element
   * Prevent user move cursor around <span> placeholder
   */
  onPlaceholderClick(event: Event, element: HTMLElement | EventTarget | null) {
    if (!element) {
      return;
    }

    const target = element as HTMLElement;
    console.log(target);
    const child = target.firstChild as HTMLElement;
    if (
      target.className?.indexOf(EditorClass.DEFAULT_VALUE) > -1 ||
      child.className?.indexOf(EditorClass.DEFAULT_VALUE) > -1
    ) {
      event.preventDefault();
      this.selection.moveCursor(this.ownerDocument, target, 0);
    }
  }
}
