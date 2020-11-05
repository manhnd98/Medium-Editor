import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export class BaseStateService<T> {
  private state$: BehaviorSubject<T>;

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<T>(initialState);
  }

  protected get state(): T {
    return this.state$.getValue();
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this.state$.asObservable().pipe(map((state) => mapFn(state), distinctUntilChanged()));
  }

  protected setState(newState: Partial<T>): void {
    this.state$.next({
      ...this.state,
      ...newState
    });
  }
}
