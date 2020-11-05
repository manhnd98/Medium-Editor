import { DOMChangesState } from '@medium-editor/models/dom-change-state.model';
import { BaseStateService } from '@medium-editor/shared/base-state.service';
import { Observable } from 'rxjs';

function initializeState(): DOMChangesState {
  return {
    newAdd: null
  };
}

export class DOMChangesStateService extends BaseStateService<DOMChangesState> {
  constructor() {
    super(initializeState());
  }

  newAdd$ = this.select<DOMChangesState['newAdd']>((state) => state.newAdd);
}
