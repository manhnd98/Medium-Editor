import { BaseStateService } from '../../base-state.service';
import { singleton } from 'tsyringe';

@singleton()
export class EventService extends BaseStateService<{}> {}
