export enum ButtonId {
  B = 'bold',
  I = 'italic',
  LINK = 'link',
  TITLE = 'h3',
  SUB_TITLE = 'h4',
  QUOTE = 'cycle-quote'
}
export interface IToolbarButton {
  /**
   * Button Id
   */
  id: ButtonId;
  /**
   * Button class
   */
  style: string;
  /**
   * SVG icon
   */
  icon: string;
  /**
   * Size in pixel
   */
  size: number;

  /**
   * Create a separator on the right of button
   */
  separator: boolean;
}

export class ToolbarButton implements IToolbarButton {
  /**
   * Create toolbar button to add into button array
   * Action of this button has be implemented in toolbar extension
   * @param id : Button id
   * @param style : button classes as a string
   * @param icon : svg icon as string
   * @param size : icon size in pixel. Default `21px`
   * @param separator: icon to separate between button actions
   */
  constructor(
    public id: ButtonId,
    public style: string,
    public icon: string,
    public size = 21,
    public separator = false
  ) {}
}

export interface IToolbarState {
  isDisplay: boolean;
}

export interface IToolbarOption {
  selector: string | HTMLElement;
}