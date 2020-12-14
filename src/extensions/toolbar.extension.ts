import { Extension, ExtensionsContainer } from '@model/extensions.model';
import {
  editorBold,
  editorItalic,
  editorLink,
  editorQuote,
  editorSubTitle,
  editorTitle
} from '@model/icon.model';
import { ButtonId, IToolbarButton, ToolbarButton } from '@model/toolbar.model';
import { OptionService } from '@state/data/option.service';
import { Utils } from 'src/helpers/utils';
import { injectable } from 'tsyringe';

@ExtensionsContainer.register('toolbar')
@injectable()
export class ToolbarExtension extends Extension {
  /**
   * Selector that contain toolbar element
   */
  selector?: string | HTMLElement;

  buttons: IToolbarButton[] = [];

  /**
   * Extension init toolbar base on user options
   */
  constructor(private optionService: OptionService, private utils: Utils) {
    super(optionService.state);
    this.initDefaultButtons();
    this.createToolbar();
  }

  /**
   * Create default buttons if user config not existed
   */
  initDefaultButtons() {
    const bold = new ToolbarButton(ButtonId.B, '', editorBold.data);
    const italic = new ToolbarButton(ButtonId.I, '', editorItalic.data);
    const link = new ToolbarButton(ButtonId.LINK, '', editorLink.data, 21, true);
    const title = new ToolbarButton(ButtonId.TITLE, '', editorTitle.data);
    const subTitle = new ToolbarButton(ButtonId.SUB_TITLE, '', editorSubTitle.data);
    const quote = new ToolbarButton(ButtonId.QUOTE, '', editorQuote.data);
    this.buttons = [bold, italic, link, title, subTitle, quote];
  }

  /**
   * Create toolbar element and add into body
   */
  createToolbar() {
    // Create arrow clip
    const arrow = this.utils.createElement(this.ownerDocument, 'span', '', 'highlightMenu-arrow');
    const arrowClip = this.utils.createElement(
      this.ownerDocument,
      'div',
      arrow,
      'highlightMenu-arrowClip'
    );

    // Create element list set of button
    const buttonSet = this.utils.createElement(this.ownerDocument, 'div', '', 'buttonSet');
    this.buttons.forEach((button) => {
      const buttonElement = this.createToolbarButton(button);
      buttonSet.appendChild(buttonElement);

      // Add separator on the right of button
      if (button.separator) {
        const separator = this.utils.createElement(
          this.ownerDocument,
          'div',
          '',
          'buttonSet-separator'
        );
        buttonSet.appendChild(separator);
      }
    });

    const toolbarInner = this.utils.createElement(this.ownerDocument, 'div', buttonSet, 'highlightMenu-inner');
    const toolbar = this.utils.createElement(this.ownerDocument, 'div', toolbarInner, 'highlightMenu');
    toolbar.appendChild(arrowClip);

    // append toolbar to document body
    this.ownerDocument.body.appendChild(toolbar);
    console.log(toolbar);
  }

  createToolbarButton(button: ToolbarButton): HTMLButtonElement {
    // Create button with setting
    const buttonClassName = 'button button--chromeless button--highlightMenu' + button.style;
    const span = this.utils.createElement(this.ownerDocument, 'span', button.icon, 'svgIcon');
    const buttonElement = this.utils.createElement(
      this.ownerDocument,
      'button',
      span,
      buttonClassName
    ) as HTMLButtonElement;
    buttonElement.setAttribute('data-action', button.id);

    // Add button with and height
    span.style.width = button.size + 'px';
    span.style.height = button.size + 'px';

    return buttonElement;
  }

  /**
   * Attach event to toolbar button base on id
   * @param id : Button id
   * @param button : Button element
   */
  attachEventHandler(id: ButtonId, button: HTMLButtonElement) {}
}
