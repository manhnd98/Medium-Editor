import { Container } from 'inversify';
import { Events } from './events';
import { Utils } from './utils';

const HelperContainer = new Container();
HelperContainer.bind<Events>(Events).toSelf();
HelperContainer.bind<Utils>(Utils).toSelf();

export default HelperContainer;
