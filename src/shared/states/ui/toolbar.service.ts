import { IToolbarState } from '@model';
import { BaseStateService } from 'src/shared/base-state.service';

function initializeState(): IToolbarState {
  return {
    isDisplay: false
  };
}

export class ToolbarStateService extends BaseStateService<IToolbarState> {
  /**
   * Is toolbar display or hidden Observable
   */
  display$ = this.select((state) => state.isDisplay);

  constructor() {
    super(initializeState());
  }
}
