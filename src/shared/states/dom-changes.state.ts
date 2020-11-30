import { Observable } from 'rxjs';
import { BaseStateService } from '../base-state.service';
import { DOMChangesState } from '../models/dom-change-state.model';

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
